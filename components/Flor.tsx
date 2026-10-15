const PETALA = 'M32 33C23 29 20 17 27 9.5C29.5 7 34.5 7 37 9.5C44 17 41 29 32 33Z';

/** Flower logo. Colours come from --f1 (petals) and --f2 (core) in globals.css: ice white by default. */
export default function Flor({ size = 36, className = '' }: { size?: number; className?: string }) {
  return (
    <svg className={`flor ${className}`} style={{ width: size, height: size }} viewBox="0 0 64 64" role="img" aria-label="Flower logo">
      {[0, 60, 120, 180, 240, 300].map((r) => (
        <path key={r} className="pt" d={PETALA} transform={`rotate(${r} 32 32)`} />
      ))}
      <g className="in">
        {[30, 90, 150, 210, 270, 330].map((r) => (
          <path key={r} className="pt" d={PETALA} transform={`rotate(${r} 32 32) translate(32 32) scale(.6) translate(-32 -32)`} />
        ))}
      </g>
      <circle className="ct" cx="32" cy="32" r="5.2" />
    </svg>
  );
}
