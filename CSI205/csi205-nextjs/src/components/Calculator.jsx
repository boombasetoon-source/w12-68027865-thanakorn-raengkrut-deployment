'use client';

import { useEffect, useReducer, useRef, useState } from 'react';
import styles from './Calculator.module.css';

const MAX_DIGITS = 12;
const ERROR = 'Error';
const OPERATOR_SYMBOL = { '+': '+', '-': '−', '*': '×', '/': '÷' };

const initialState = {
  display: '0', // ข้อความบนจอ (ยังไม่ใส่ comma)
  operand: null, // ตัวเลขตัวแรกที่รอคำนวณ
  operator: null, // + - * / ที่เลือกไว้
  overwrite: true, // ตัวเลขถัดไปที่พิมพ์ให้แทนที่ของเดิม
  entered: false, // ป้อนตัวเลขตัวที่สองหลังเลือก operator แล้วหรือยัง
  repeat: null, // จำ operator และตัวเลขล่าสุด ไว้ใช้ตอนกด = ซ้ำ
  memory: 0,
};

// ---------- ฟังก์ชันช่วย ----------

function compute(a, b, operator) {
  switch (operator) {
    case '+':
      return a + b;
    case '-':
      return a - b;
    case '*':
      return a * b;
    case '/':
      return b === 0 ? NaN : a / b;
    default:
      return b;
  }
}

// แปลงผลลัพธ์เป็นข้อความ ตัดเศษทศนิยมจากการคำนวณ floating point (เช่น 0.1 + 0.2)
function toText(value) {
  if (!Number.isFinite(value)) return ERROR;
  const rounded = Number.parseFloat(value.toPrecision(MAX_DIGITS));
  const abs = Math.abs(rounded);
  if (abs !== 0 && (abs >= 1e15 || abs < 1e-9)) {
    return rounded.toExponential(6).replace(/\.?0+e/, 'e');
  }
  return String(rounded);
}

// ใส่ comma คั่นหลักพัน: 1234.5 -> 1,234.5
export function formatDisplay(text) {
  if (text === ERROR || text.includes('e')) return text;
  const negative = text.startsWith('-');
  const [integer, decimal] = (negative ? text.slice(1) : text).split('.');
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${negative ? '-' : ''}${grouped}${decimal !== undefined ? `.${decimal}` : ''}`;
}

const countDigits = (text) => text.replace(/[^0-9]/g, '').length;

const toError = (state) => ({ ...initialState, display: ERROR, memory: state.memory });

// ผลของปุ่มที่ทำกับตัวเลขบนจอทันที (√, 1/x, %)
function applyUnary(state, value) {
  const display = toText(value);
  if (display === ERROR) return toError(state);
  return { ...state, display, overwrite: true, entered: true };
}

// ---------- reducer ----------

function reducer(state, action) {
  if (state.display === ERROR) {
    if (action.type === 'digit' || action.type === 'dot') {
      state = { ...initialState, memory: state.memory };
    } else if (!['clear', 'mc', 'mr'].includes(action.type)) {
      return state;
    }
  }

  const current = Number(state.display);

  switch (action.type) {
    case 'digit': {
      if (state.overwrite) {
        return { ...state, display: action.digit, overwrite: false, entered: true };
      }
      if (countDigits(state.display) >= MAX_DIGITS) return state;
      let display = state.display + action.digit;
      if (state.display === '0') display = action.digit;
      if (state.display === '-0') display = `-${action.digit}`;
      return { ...state, display, entered: true };
    }

    case 'dot': {
      if (state.overwrite) {
        return { ...state, display: '0.', overwrite: false, entered: true };
      }
      if (state.display.includes('.')) return state;
      return { ...state, display: `${state.display}.`, entered: true };
    }

    case 'backspace': {
      if (state.overwrite) return state;
      const display = state.display.slice(0, -1);
      return { ...state, display: display === '' || display === '-' ? '0' : display };
    }

    case 'sign': {
      if (state.display === '0') return state;
      const display = state.display.startsWith('-') ? state.display.slice(1) : `-${state.display}`;
      return { ...state, display, entered: true };
    }

    case 'operator': {
      // กด operator ต่อกัน เช่น 2 + 3 × ... ให้คำนวณผลก่อนหน้าก่อน
      if (state.operator && state.entered) {
        const display = toText(compute(state.operand, current, state.operator));
        if (display === ERROR) return toError(state);
        return {
          ...state,
          display,
          operand: Number(display),
          operator: action.operator,
          overwrite: true,
          entered: false,
          repeat: null,
        };
      }
      return {
        ...state,
        operand: current,
        operator: action.operator,
        overwrite: true,
        entered: false,
        repeat: null,
      };
    }

    case 'equals': {
      let a, b, operator;
      if (state.operator) {
        a = state.operand;
        b = state.entered ? current : state.operand; // 5 + = ได้ 10
        operator = state.operator;
      } else if (state.repeat) {
        a = current;
        b = state.repeat.value;
        operator = state.repeat.operator;
      } else {
        return { ...state, overwrite: true };
      }

      const display = toText(compute(a, b, operator));
      if (display === ERROR) return toError(state);
      return {
        ...state,
        display,
        operand: null,
        operator: null,
        overwrite: true,
        entered: false,
        repeat: { operator, value: b },
      };
    }

    case 'sqrt':
      return applyUnary(state, current < 0 ? NaN : Math.sqrt(current));

    case 'reciprocal':
      return applyUnary(state, current === 0 ? NaN : 1 / current);

    case 'percent': {
      // 200 + 10% = 220 , 200 × 10% = 20
      const additive = state.operator === '+' || state.operator === '-';
      return applyUnary(state, additive ? (state.operand * current) / 100 : current / 100);
    }

    case 'clear':
      return { ...initialState, memory: state.memory };

    case 'mc':
      return { ...state, memory: 0 };

    case 'mr':
      return { ...state, display: toText(state.memory), overwrite: true, entered: true };

    case 'mplus':
    case 'mminus': {
      const memory = state.memory + (action.type === 'mplus' ? current : -current);
      return { ...state, memory: Number.isFinite(memory) ? memory : state.memory, overwrite: true };
    }

    default:
      return state;
  }
}

// ---------- ปุ่ม ----------

const digit = (d) => ({ label: d, action: { type: 'digit', digit: d }, kind: 'digit' });
const op = (label, operator, kind = 'func') => ({ label, action: { type: 'operator', operator }, kind });

const BUTTONS = [
  { label: 'MC', action: { type: 'mc' }, kind: 'memory' },
  { label: 'MR', action: { type: 'mr' }, kind: 'memory' },
  { label: 'M+', action: { type: 'mplus' }, kind: 'memory' },
  { label: 'M−', action: { type: 'mminus' }, kind: 'memory' },
  { label: 'C', action: { type: 'clear' }, kind: 'clear' },

  digit('7'), digit('8'), digit('9'),
  op('÷', '/'),
  { label: '√', action: { type: 'sqrt' }, kind: 'func' },

  digit('4'), digit('5'), digit('6'),
  op('×', '*'),
  { label: '1/x', action: { type: 'reciprocal' }, kind: 'func' },

  digit('1'), digit('2'), digit('3'),
  op('−', '-', 'operator'),
  { label: '%', action: { type: 'percent' }, kind: 'func' },

  digit('0'),
  { label: '.', action: { type: 'dot' }, kind: 'light' },
  { label: '+/-', action: { type: 'sign' }, kind: 'light' },
  op('+', '+', 'operator'),
  { label: '=', action: { type: 'equals' }, kind: 'operator' },
];

// ปุ่มบนคีย์บอร์ด -> ป้ายของปุ่มบนเครื่องคิดเลข
const KEY_MAP = {
  '.': '.', ',': '.',
  '+': '+', '-': '−', '*': '×', x: '×', X: '×', '/': '÷',
  '=': '=', Enter: '=',
  Escape: 'C', Delete: 'C', c: 'C', C: 'C',
  '%': '%',
};

export default function Calculator() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [pressed, setPressed] = useState(null);
  const pressTimer = useRef(null);

  // ทำให้ปุ่มกระพริบเหมือนถูกกด เวลาใช้คีย์บอร์ด
  const flash = (label) => {
    setPressed(label);
    clearTimeout(pressTimer.current);
    pressTimer.current = setTimeout(() => setPressed(null), 120);
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      // Enter/Space บนปุ่มที่ถูกโฟกัสให้ทำงานตามปกติของปุ่ม
      if ((e.key === 'Enter' || e.key === ' ') && e.target.closest?.('button, a')) return;

      if (e.key === 'Backspace') {
        e.preventDefault();
        dispatch({ type: 'backspace' });
        return;
      }

      const label = /^[0-9]$/.test(e.key) ? e.key : KEY_MAP[e.key];
      const button = BUTTONS.find((b) => b.label === label);
      if (!button) return;

      e.preventDefault();
      dispatch(button.action);
      flash(button.label);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      clearTimeout(pressTimer.current);
    };
  }, []);

  const text = formatDisplay(state.display);
  const sizeClass = text.length > 16 ? styles.small : text.length > 12 ? styles.medium : '';
  const expression =
    state.operator && state.operand !== null
      ? `${formatDisplay(toText(state.operand))} ${OPERATOR_SYMBOL[state.operator]}`
      : '';

  return (
    <section>
      <div className={styles.calculator}>
        <div className={styles.screen}>
          <div className={styles.screenTop}>
            <span className={styles.memoryFlag} title="มีค่าในหน่วยความจำ">
              {state.memory !== 0 ? 'M' : ''}
            </span>
            <span>{expression}</span>
          </div>
          <output className={`${styles.value} ${sizeClass}`} aria-live="polite">
            {text}
          </output>
        </div>

        {/* กันปุ่มแย่งโฟกัสเมื่อคลิกด้วยเมาส์ เพื่อให้กด Enter บนคีย์บอร์ดแล้วไม่ทำงานซ้ำ */}
        <div className={styles.keys} onMouseDown={(e) => e.preventDefault()}>
          {BUTTONS.map((button) => {
            const selected =
              button.action.type === 'operator' &&
              button.action.operator === state.operator &&
              !state.entered;
            return (
              <button
                key={button.label}
                type="button"
                className={[
                  styles.key,
                  styles[button.kind],
                  selected ? styles.selected : '',
                  pressed === button.label ? styles.pressed : '',
                ].join(' ')}
                onClick={() => dispatch(button.action)}
              >
                {button.label}
              </button>
            );
          })}
        </div>
      </div>

      <p className={styles.hint}>
        ใช้คีย์บอร์ดได้: <kbd>0</kbd>–<kbd>9</kbd> <kbd>.</kbd> <kbd>+</kbd> <kbd>-</kbd> <kbd>*</kbd>{' '}
        <kbd>/</kbd> <kbd>%</kbd> <kbd>Enter</kbd> <kbd>Backspace</kbd> <kbd>Esc</kbd>
      </p>
    </section>
  );
}
