'use client';
import { useState } from 'react';
import Reveal from './Reveal';

const W = 760, H = 340, L = 54, B = 36;
const gx = (r: number) => L + ((r - 750) / 6450) * (W - L - 12);
const gy = (f: number) => H - B - (f / 3000) * (H - B - 14);
const ORD = [{ m: 1, c: '#00f0ff' }, { m: 2, c: '#ff2e63' }, { m: 3, c: '#94a3b8' }];

export function HarmonicsChart() {
  const [v12, setV12] = useState(true);
  const mult = v12 ? 6 : 3;
  return (
    <div className="panel p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h3 className="text-xl font-bold text-ice">0–3 kHz harmonic spectrogram</h3><p className="text-sm text-ti">1×, 2× and 3× firing orders versus RPM. The 400–900 Hz band is the V12 sweet spot.</p></div>
        <div className="flex rounded-full border border-white/15 p-1 text-xs">
          {[[false, 'Stock inline-6 (3×/rev)'], [true, 'V12 emulation (6×/rev)']].map(([k, l]) => (
            <button key={String(k)} onClick={() => setV12(k as boolean)} aria-pressed={v12 === k} className={`rounded-full px-3 py-1.5 ${v12 === k ? 'bg-ice text-black' : 'text-ti'}`}>{l as string}</button>
          ))}
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full" role="img" aria-label="Order harmonics versus RPM">
        <rect x={L} y={gy(900)} width={W - L - 12} height={gy(400) - gy(900)} fill="#00f0ff" fillOpacity=".1" />
        <text x={L + 6} y={gy(900) + 14} fill="#00f0ff" fontSize="11" fontFamily="monospace">400–900 Hz · V12 sweet spot</text>
        {[0, 1000, 2000, 3000].map((f) => <g key={f}><line x1={L} x2={W - 12} y1={gy(f)} y2={gy(f)} stroke="#1f2937" /><text x="8" y={gy(f) + 4} fill="#94a3b8" fontSize="11" fontFamily="monospace">{f / 1000}k</text></g>)}
        {[1000, 3000, 5000, 7000].map((r) => <text key={r} x={gx(r) - 10} y={H - 12} fill="#94a3b8" fontSize="11" fontFamily="monospace">{r / 1000}k</text>)}
        <line x1={L} x2={W - 12} y1={gy(204)} y2={gy(204)} stroke="#ff2e63" strokeDasharray="5 4" /><text x={W - 150} y={gy(204) - 5} fill="#ff2e63" fontSize="11" fontFamily="monospace">J-pipe null · 204 Hz</text>
        {ORD.map(({ m, c }) => {
          let d = '', last: [number, number] = [0, 0];
          for (let r = 750; r <= 7200; r += 150) { const f = (r / 60) * mult * m; if (f > 3000) break; d += `${d ? 'L' : 'M'}${gx(r)} ${gy(f)} `; last = [gx(r), gy(f)]; }
          return <g key={m}><path d={d} stroke={c} strokeWidth="2.5" fill="none" /><text x={last[0] - 4} y={last[1] - 8} fill={c} fontSize="12" fontFamily="monospace">{m}×</text></g>;
        })}
        <text x={W / 2 - 20} y={H - 1} fill="#64748b" fontSize="10" fontFamily="monospace">engine speed (RPM)</text>
      </svg>
    </div>
  );
}

export function FiringOrder() {
  const ORDER = [1, 5, 3, 6, 2, 4], FW = 560, x = (a: number) => 52 + (a / 720) * (FW - 70);
  return (
    <div className="panel p-5 sm:p-6">
      <h3 className="text-xl font-bold text-ice">720° combustion cycle · firing order 1-5-3-6-2-4</h3>
      <p className="text-sm text-ti"><span className="text-bank1">Cyl 1-3 → Bank 1</span> · <span className="text-bank2">Cyl 4-6 → Bank 2</span> · one pulse every 120°, alternating banks.</p>
      <svg viewBox={`0 0 ${FW} 250`} className="mt-4 w-full" role="img" aria-label="Firing order diagram">
        {[1, 2, 3, 4, 5, 6].map((c, i) => <g key={c}><text x="4" y={30 + i * 32 + 4} fill="#94a3b8" fontSize="11" fontFamily="monospace">Cyl {c}</text><line x1="48" x2={FW - 14} y1={30 + i * 32} y2={30 + i * 32} stroke="#1f2937" /></g>)}
        {ORDER.map((c, k) => <circle key={c} cx={x(k * 120)} cy={30 + (c - 1) * 32} r="8" fill={c <= 3 ? '#00f0ff' : '#ff2e63'} />)}
        {ORDER.map((c, k) => <text key={'t' + c} x={x(k * 120) - 3} y={30 + (c - 1) * 32 + 4} fill="#000" fontSize="10" fontWeight="700" fontFamily="monospace">{k + 1}</text>)}
        {[0, 120, 240, 360, 480, 600, 720].map((a) => <text key={a} x={x(a) - 12} y="236" fill="#94a3b8" fontSize="11" fontFamily="monospace">{a}°</text>)}
        <line y1="8" y2="214" stroke="#EAF6FF" strokeWidth="2"><animate attributeName="x1" values={`${x(0)};${x(720)}`} dur="6s" repeatCount="indefinite" /><animate attributeName="x2" values={`${x(0)};${x(720)}`} dur="6s" repeatCount="indefinite" /></line>
      </svg>
    </div>
  );
}

export default function SpectrogramChart() {
  return (
    <section id="diagnostics" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <Reveal><p className="eyebrow">04 · Diagnostics &amp; spectrum dashboard</p><h2 className="mt-3 max-w-3xl text-3xl font-black text-ice sm:text-5xl">Read the sound.</h2></Reveal>
      <div className="mt-12 grid gap-5 lg:grid-cols-[1.4fr_1fr]"><Reveal><HarmonicsChart /></Reveal><Reveal delay={0.08}><FiringOrder /></Reveal></div>
      <p className="mt-4 text-xs text-ti/70">Charts are analytic (order = rpm/60 × pulses-per-rev × n). For the measured response of the pipe network, use the Simulator tab.</p>
    </section>
  );
}
