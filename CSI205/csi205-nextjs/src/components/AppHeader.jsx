const TILES = [
  { char: 'C', color: '#e53935', tilt: -7 },
  { char: 'S', color: '#2eb84a', tilt: 4 },
  { char: 'I', color: '#1e6ff0', tilt: -3 },
  { char: '2', color: '#2aa8d8', tilt: 6 },
  { char: '0', color: '#f5b301', tilt: -5 },
  { char: '5', color: '#5f6670', tilt: 3 },
];

export default function AppHeader() {
  return (
    <header className="text-center">
      <div className="csi-tiles" role="img" aria-label="CSI205">
        {TILES.map((tile, i) => (
          <span
            key={i}
            className="csi-tile"
            style={{ background: tile.color, '--tilt': `${tile.tilt}deg` }}
            aria-hidden="true"
          >
            {tile.char}
          </span>
        ))}
      </div>
      <h1 className="csi-subtitle">FRONT END SOFTWARE DEVELOPMENT</h1>
    </header>
  );
}
