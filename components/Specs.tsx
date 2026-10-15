import { Layers, Gauge, Flame, Wrench, Volume2, Weight } from 'lucide-react';
import Reveal from './Reveal';

const SPECS = [
  { i: Layers, t: 'Titanium Grade 2', v: 't = 1.0 mm', d: 'Thin-wall TIG-welded construction. Lighter, higher-pitched ring than stainless; roughly 13.6 kg of Ti for the whole system.' },
  { i: Gauge, t: 'Stepped expansion', v: '2.75" → 2.5" → 3.0"', d: 'Ø70 mm downpipes, Ø63.5 mm mid-section and X-pipe, Ø76.2 mm tail pipes feeding the tips.' },
  { i: Flame, t: 'Dual slash-cut tips', v: '2 × Ø114.3 mm (4.5")', d: 'Carbon-clad sleeve over a Ø101.6 mm titanium liner, 15° slash cut, Divina script laser-engraved.' },
  { i: Volume2, t: 'Valve-controlled', v: '15–20 dB quieter', d: 'Actuated valves switch between the Ø76 mm straight core and the Ø44.5 mm baffled path.' },
  { i: Wrench, t: 'Pie-cut bends', v: '15° per segment', d: 'Hand-built look: every bend is a polyline of mitred segments, welded joint by joint.' },
  { i: Weight, t: 'V-band joints', v: '±0.2 mm flanges', d: 'Low-profile V-band clamps between downpipes, mid-pipes, X-pipe and tail section.' },
];

function TipEngraving() {
  return (
    <div className="panel mt-12 grid items-center gap-8 p-6 sm:p-8 md:grid-cols-2">
      <svg viewBox="0 0 420 200" className="w-full" role="img" aria-label="Divina script laser-engraved on the carbon fibre tailpipe sleeve">
        <defs>
          <pattern id="twill" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="8" height="8" fill="#0a0a0c" /><rect width="4" height="8" fill="#15161a" /><rect y="4" width="8" height="4" fill="#101114" opacity=".8" />
          </pattern>
          <linearGradient id="sheen" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".16" /><stop offset=".45" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".5" /></linearGradient>
        </defs>
        <rect x="10" y="30" width="400" height="140" rx="70" fill="url(#twill)" stroke="#2a2d33" />
        <rect x="10" y="30" width="400" height="140" rx="70" fill="url(#sheen)" />
        <ellipse cx="398" cy="100" rx="22" ry="68" fill="#000" stroke="#94a3b8" strokeWidth="3" />
        <text x="195" y="116" textAnchor="middle" fontSize="64" fill="#EAF6FF" style={{ fontFamily: 'var(--font-script), cursive', filter: 'drop-shadow(0 0 4px rgba(143,211,244,.55))' }}>Divina</text>
      </svg>
      <div>
        <p className="eyebrow">Laser-engraved signature</p>
        <h3 className="mt-2 text-2xl font-bold text-ice">Divina script on every tip</h3>
        <p className="mt-3 text-sm leading-relaxed text-ti">Elegant cursive lettering laser-etched into the Ø114.3 mm carbon-fibre sleeve of both tailpipes, finished with a silver-white mark against the black twill weave.</p>
      </div>
    </div>
  );
}

export default function Specs() {
  return (
    <section id="specs" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <Reveal><p className="eyebrow">05 · Specifications &amp; dual-tip design</p><h2 className="mt-3 max-w-3xl text-3xl font-black text-ice sm:text-5xl">Built like motorsport hardware.</h2></Reveal>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SPECS.map(({ i: Icon, t, v, d }, k) => (
          <Reveal key={t} delay={(k % 3) * 0.07}>
            <div className="panel h-full p-6 transition hover:border-ice2/40">
              <Icon className="text-ice2" size={26} />
              <h3 className="mt-4 text-lg font-bold text-ice">{t}</h3>
              <p className="font-mono text-sm text-bank1">{v}</p>
              <p className="mt-3 text-sm leading-relaxed text-ti">{d}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal><TipEngraving /></Reveal>
    </section>
  );
}
