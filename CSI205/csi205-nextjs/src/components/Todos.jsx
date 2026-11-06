'use client';

import { useEffect, useState } from 'react';
import { useApp } from './AppProvider';
import styles from './Todos.module.css';

const PAGE_SIZES = [5, 10, 20, 50];

export default function Todos() {
  const { todos, setTodos } = useApp();
  const [onlyWaiting, setOnlyWaiting] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [newTitle, setNewTitle] = useState('');

  const filtered = onlyWaiting ? todos.filter((t) => !t.completed) : todos;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pageCount);
  const visible = filtered.slice((current - 1) * pageSize, current * pageSize);

  // ถ้าลบ/กรองจนหน้าปัจจุบันว่าง ให้ถอยกลับมาหน้าสุดท้ายที่มีข้อมูล
  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  function toggle(id) {
    setTodos((list) => list.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }

  function remove(id) {
    setTodos((list) => list.filter((t) => t.id !== id));
  }

  function add(event) {
    event.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    setTodos((list) => {
      const id = list.reduce((max, t) => Math.max(max, t.id), 0) + 1;
      return [...list, { id, title, completed: false }];
    });
    setNewTitle('');
    setOnlyWaiting(false);
    setPage(Math.ceil((todos.length + 1) / pageSize));
  }

  const waitingCount = todos.filter((t) => !t.completed).length;

  return (
    <section className={`card ${styles.card}`}>
      <div className={styles.toolbar}>
        <div className="form-check form-switch m-0">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="only-waiting"
            checked={onlyWaiting}
            onChange={(e) => {
              setOnlyWaiting(e.target.checked);
              setPage(1);
            }}
          />
          <label className="form-check-label" htmlFor="only-waiting">
            Show only <span className="badge text-bg-warning">waiting</span>
          </label>
        </div>

        <select
          className="form-select form-select-sm w-auto"
          aria-label="จำนวนรายการต่อหน้า"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size} items per page
            </option>
          ))}
        </select>
      </div>

      <form className="input-group input-group-sm mb-2" onSubmit={add}>
        <input
          type="text"
          className="form-control"
          placeholder="เพิ่มงานใหม่…"
          aria-label="ชื่องานใหม่"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={!newTitle.trim()}>
          <i className="bi bi-plus-lg" aria-hidden="true" /> Add
        </button>
      </form>

      <table className={`table table-sm table-striped align-middle ${styles.table}`}>
        <thead className="table-dark">
          <tr>
            <th className={styles.idCol}>ID</th>
            <th>Title</th>
            <th className={styles.actionCol}>Completed</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((todo) => (
            <tr key={todo.id}>
              <td className={styles.idCol}>
                <span className="badge text-bg-secondary">{todo.id}</span>
              </td>
              <td className={todo.completed ? styles.done : undefined}>{todo.title}</td>
              <td className={styles.actionCol}>
                <button
                  type="button"
                  className={`btn btn-sm ${todo.completed ? 'btn-success' : 'btn-warning'} ${styles.status}`}
                  onClick={() => toggle(todo.id)}
                  aria-label={`เปลี่ยนสถานะงาน ${todo.id}`}
                >
                  {todo.completed ? 'done' : 'waiting'}
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => remove(todo.id)}
                  aria-label={`ลบงาน ${todo.id}`}
                >
                  <i className="bi bi-trash" aria-hidden="true" />
                </button>
              </td>
            </tr>
          ))}
          {visible.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center text-secondary py-3">
                ไม่มีรายการ
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className={styles.footer}>
        <small className="text-secondary">
          ทั้งหมด {todos.length} งาน · ค้าง {waitingCount}
        </small>
        <div className="btn-group btn-group-sm" role="group" aria-label="เปลี่ยนหน้า">
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => setPage(1)}
            disabled={current === 1}
          >
            First
          </button>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => setPage(current - 1)}
            disabled={current === 1}
          >
            Previous
          </button>
          <span className={`btn btn-outline-secondary disabled ${styles.pageInfo}`}>
            {current} / {pageCount}
          </span>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => setPage(current + 1)}
            disabled={current === pageCount}
          >
            Next
          </button>
          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={() => setPage(pageCount)}
            disabled={current === pageCount}
          >
            Last
          </button>
        </div>
      </div>
    </section>
  );
}
