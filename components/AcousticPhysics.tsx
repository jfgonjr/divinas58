'use client';
import { useState } from 'react';
import Reveal from './Reveal';

const Card = ({ n, title, children, tag }: { n: string; title: string; tag: string; children: React.ReactNode }) => (
  <div className="panel flex h-full flex-col p-6">
    <div className="flex items-center justify-between"><span className="font-mono text-xs text-ice2">{n}</span><span className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ti">{tag}</span></div>
    <h3 className="mt-3 text-xl font-bold text-ice">{title}</h3>
    {children}
  </div>
);

function Geometry() {
  const [hover, setHover] = useState<1 | 2 | null>(null);
  const row = (y: number, down: number, pipe: number, c: string, label: string, k: 1 | 2) => (
    <g onMouseEnter={() => setHover(k)} onMouseLeave={() => setHover(null)} opacity={hover && hover !== k ? 0.35 : 1} style={{ transition: 'opacity .2s' }}>
      <text x="0" y={y - 10} fill={c} fontSize="11" fontFamily="monospace">{label}</text>
      <rect x="0" y={y} width={down * 0.1} height="16" rx="3" fill={c} fillOpacity=".45" />
      <rect x={down * 0.1} y={y} width={pipe * 0.1} height="16" rx="3" fill={c} />
      <text x={down * 0.1 + 4} y={y + 12} fill="#000" fontSize="10" fontFamily="monospace" fontWeight="700">{pipe} mm</text>
      <text x="4" y={y + 12} fill="#fff" fontSize="10" fontFamily="monospace">{down}</text>
    </g>
  );
  return (
    <>
      <svg viewBox="0 0 300 120" className="mt-5 w-full" role="img" aria-label="Bank 1 and Bank 2 pipe length comparison">
        {row(22, 598, 1698, '#00f0ff', 'BANK 1 · loop', 1)}
        {row(72, 598, 1368, '#ff2e63', 'BANK 2 · straight', 2)}
        <rect x="196.6" y="19" width="33" height="20" fill="none" stroke="#EAF6FF" strokeDasharray="3 2" />
        <text x="150" y="58" fill="#EAF6FF" fontSize="10" fontFamily="monospace">+330 mm compensation</text>
      </svg>
      <ul className="mt-3 space-y-1 font-mono text-xs text-ti">
        <li><span className="text-bank1">Bank 1:</span> 598 mm downpipe + 1698 mm pipe</li>
        <li><span className="text-bank2">Bank 2:</span> 598 mm downpipe + 1368 mm pipe</li>
        <li>Δ = 1698 − 1368 = <b className="text-ice">330 mm</b> (±0.5 mm)</li>
      </ul>
    </>
  );
}

function XPipe() {
  return (
    <>
      <svg viewBox="0 0 300 120" className="mt-5 w-full" role="img" aria-label="18 degree X-pipe crossover">
        <path d="M0 35 L110 52 Q150 60 190 68 L300 85" stroke="#00f0ff" strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M0 85 L110 68 Q150 60 190 52 L300 35" stroke="#ff2e63" strokeWidth="9" fill="none" strokeLinecap="round" strokeOpacity=".85" />
        <path d="M120 60 H180" stroke="#EAF6FF" strokeDasharray="3 3" />
        <path d="M150 60 L235 38" stroke="#94a3b8" /><path d="M150 60 L235 60" stroke="#94a3b8" />
        <text x="238" y="42" fill="#94a3b8" fontSize="11" fontFamily="monospace">18°</text>
      </svg>
      <p className="mt-3 text-sm text-ti">Zero phase delay at the high-velocity crossover forces perfect <b className="text-ice">120° pulse interleaving</b> between banks.</p>
      <div className="mt-3 font-mono text-sm text-ice">Δt = 579 µs <span className="text-ti">· 330 mm ÷ 570 m/s</span></div>
    </>
  );
}

function Helmholtz() {
  return (
    <>
      <svg viewBox="0 0 300 120" className="mt-5 w-full" role="img" aria-label="650 mm J-pipe resonators">
        <path d="M0 40 H300" stroke="#94a3b8" strokeWidth="9" />
        <path d="M120 40 V95 H270" stroke="#ff2e63" strokeWidth="7" fill="none" strokeLinejoin="round" />
        <circle cx="270" cy="95" r="5" fill="#ff2e63" />
        <path d="M120 108 H270" stroke="#EAF6FF" /><text x="150" y="119" fill="#EAF6FF" fontSize="10" fontFamily="monospace">L = 650 mm (λ/4)</text>
        {[0, 1, 2].map((i) => <path key={i} d={`M${20 + i * 28} 12 q8 -8 16 0 t16 0`} stroke="#00f0ff" strokeOpacity={1 - i * 0.3} fill="none" />)}
      </svg>
      <p className="mt-3 text-sm text-ti">Dual telescopic <b className="text-ice">650 mm Helmholtz J-pipes</b> reflect a quarter wavelength at <b className="text-ice">204 Hz</b>, cancelling low-end cabin drone by destructive interference.</p>
      <div className="mt-3 font-mono text-xs text-ti">f = c / 4L = 530 / (4 × 0.650) ≈ 204 Hz</div>
    </>
  );
}

function ValveGraph() {
  const [open, setOpen] = useState(true);
  const f = (a: number) => Array.from({ length: 31 }, (_, i) => { const x = 10 + i * 9, t = i / 30; return `${i ? 'L' : 'M'}${x} ${100 - (a * (0.55 + 0.45 * Math.sin(t * 5 + 1)) + (1 - a) * 0) * 80}`; }).join(' ');
  return (
    <>
      <div className="mt-4 flex gap-2 text-xs">
        {[true, false].map((v) => <button key={String(v)} onClick={() => setOpen(v)} aria-pressed={open === v} className={`rounded-full border px-3 py-1 transition ${open === v ? 'border-ice bg-ice/10 text-ice' : 'border-white/10 text-ti'}`}>Valve {v ? 'open' : 'closed'}</button>)}
      </div>
      <svg viewBox="0 0 290 120" className="mt-3 w-full" role="img" aria-label="Valve open versus closed sound level">
        <line x1="10" y1="100" x2="280" y2="100" stroke="#334155" />
        <path d={f(1)} stroke="#00f0ff" strokeWidth={open ? 3 : 1} strokeOpacity={open ? 1 : 0.3} fill="none" style={{ transition: 'all .3s' }} />
        <path d={f(0.17)} stroke="#ff2e63" strokeWidth={open ? 1 : 3} strokeOpacity={open ? 0.3 : 1} fill="none" style={{ transition: 'all .3s' }} />
        <line x1="255" y1="22" x2="255" y2="86" stroke="#EAF6FF" strokeDasharray="3 2" />
        <text x="190" y="14" fill="#EAF6FF" fontSize="10" fontFamily="monospace">−15 to −20 dB</text>
      </svg>
      <p className="mt-2 text-sm text-ti">Valve-controlled dual profile: full flow (Ø76 mm core) versus the Ø44.5 mm baffled path, <b className="text-ice">15–20 dB</b> quieter when closed.</p>
    </>
  );
}

export default function AcousticPhysics() {
  return (
    <section id="physics" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <Reveal><p className="eyebrow">02 · Acoustic engineering</p><h2 className="mt-3 max-w-3xl text-3xl font-black text-ice sm:text-5xl">Physics, not volume.</h2></Reveal>
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        <Reveal><Card n="01" tag="Geometry" title="Bank 1 Equalization Loop (+330 mm)"><Geometry /></Card></Reveal>
        <Reveal delay={0.08}><Card n="02" tag="Phase" title="Zero Phase Delay X-Pipe"><XPipe /></Card></Reveal>
        <Reveal><Card n="03" tag="Resonator" title="Anti-Drone Technology"><Helmholtz /></Card></Reveal>
        <Reveal delay={0.08}><Card n="04" tag="Valve" title="Dual Sound Profile"><ValveGraph /></Card></Reveal>
      </div>
    </section>
  );
}
