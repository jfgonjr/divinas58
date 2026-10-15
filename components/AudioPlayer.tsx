'use client';
import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import S58Engine, { type S58 } from '@/lib/s58Engine';

type Mode = 'stock' | 'v12';
const RPMS = [{ l: 'Idle', r: 1000 }, { l: 'Mid', r: 3000 }, { l: 'High', r: 5000 }, { l: 'Redline', r: 7200 }];

/* Same synthesis engine as the Simulator tab (untouched). A/B only changes its settings. */
function configure(e: S58, mode: Mode) {
  e.valve = 'auto'; e.pops = false; e.vol = 1; e.cabin = false;
  if (mode === 'v12') { e.setComp(330, 0); e.v12 = true; } else { e.setComp(0, 0); e.v12 = false; }
}

export default function AudioPlayer() {
  const [on, setOn] = useState(false);
  const [mode, setMode] = useState<Mode>('v12');
  const [rpm, setRpm] = useState(3000);
  const [live, setLive] = useState({ rpm: 1000, hz: 0 });
  const rt = useRef<{ ctx: AudioContext; eng: S58; an: AnalyserNode; sp: ScriptProcessorNode } | null>(null);
  const want = useRef({ mode, rpm }); want.current = { mode, rpm };
  const wave = useRef<HTMLCanvasElement>(null);
  const spec = useRef<HTMLCanvasElement>(null);

  const start = async () => {
    if (!rt.current) {
      const ctx = new AudioContext();
      const eng = S58Engine(ctx.sampleRate);
      configure(eng, want.current.mode);
      const sp = ctx.createScriptProcessor(2048, 0, 2);
      sp.onaudioprocess = (e) => eng.process(e.outputBuffer.getChannelData(0), e.outputBuffer.getChannelData(1), 2048);
      const an = ctx.createAnalyser(); an.fftSize = 4096; an.smoothingTimeConstant = 0.6;
      sp.connect(an); an.connect(ctx.destination);
      rt.current = { ctx, eng, an, sp };
    }
    await rt.current.ctx.resume(); setOn(true);
  };
  const toggle = async () => { if (on) { await rt.current?.ctx.suspend(); setOn(false); } else await start(); };

  useEffect(() => { if (rt.current) configure(rt.current.eng, mode); }, [mode]);

  useEffect(() => {
    let raf = 0, tick = 0;
    const wc = wave.current!.getContext('2d')!, sc = spec.current!.getContext('2d')!;
    sc.fillStyle = '#05070a'; sc.fillRect(0, 0, 960, 170);
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const r = rt.current;
      wc.clearRect(0, 0, 960, 90);
      if (!r || r.ctx.state !== 'running') return;
      const { eng, an } = r;
      eng.pedal = 0.3; eng.rpm += (want.current.rpm - eng.rpm) * 0.15; // hold the selected rpm
      const t = new Float32Array(2048); an.getFloatTimeDomainData(t);
      wc.strokeStyle = want.current.mode === 'v12' ? '#00f0ff' : '#94a3b8'; wc.lineWidth = 1.5; wc.beginPath();
      for (let i = 0; i < 2048; i++) { const x = (i / 2048) * 960, y = 45 - t[i] * 42; i ? wc.lineTo(x, y) : wc.moveTo(x, y); }
      wc.stroke();
      const d = new Uint8Array(an.frequencyBinCount), hz = r.ctx.sampleRate / an.fftSize; an.getByteFrequencyData(d);
      sc.drawImage(spec.current!, -2, 0);
      for (let y = 0; y < 170; y += 2) {
        const a = (d[Math.floor((1 - y / 170) * 3000 / hz)] || 0) / 255;
        sc.fillStyle = `rgb(${(a * 420) | 0},${(Math.max(0, a - 0.4) * 420) | 0},${(a * 255) | 0})`; sc.fillRect(958, y, 2, 2);
      }
      if (++tick % 6 === 0) setLive({ rpm: Math.round(eng.rpm), hz: Math.round((eng.rpm / 60) * (want.current.mode === 'v12' ? 6 : 3)) });
    };
    frame();
    return () => { cancelAnimationFrame(raf); rt.current?.ctx.close(); rt.current = null; };
  }, []);

  return (
    <div className="panel mx-auto mt-10 w-full max-w-4xl p-5 text-left sm:p-7">
      <div className="flex flex-wrap items-center gap-4">
        <button onClick={toggle} aria-label={on ? 'Pause audio' : 'Play audio'}
          className="grid h-14 w-14 place-items-center rounded-full bg-ice text-black transition hover:scale-105">
          {on ? <Pause /> : <Play className="translate-x-0.5" />}
        </button>
        <div role="group" aria-label="Sound profile" className="flex rounded-full border border-white/15 p-1 text-sm">
          {([['stock', 'Stock OEM Sound'], ['v12', 'S58 V12 Equal-Length Sound']] as const).map(([k, l]) => (
            <button key={k} onClick={() => setMode(k)} aria-pressed={mode === k}
              className={`rounded-full px-4 py-2 transition ${mode === k ? (k === 'v12' ? 'bg-bank1 text-black' : 'bg-ti text-black') : 'text-ti hover:text-ice'}`}>{l}</button>
          ))}
        </div>
        <div className="ml-auto text-right font-mono text-xs text-ti">
          <div className="text-2xl text-ice">{on ? live.rpm : rpm} <span className="text-xs text-ti">rpm</span></div>
          <div>{on ? live.hz : Math.round((rpm / 60) * (mode === 'v12' ? 6 : 3))} Hz ignition</div>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {RPMS.map((p) => (
          <button key={p.r} onClick={() => { setRpm(p.r); if (!on) start(); }} aria-pressed={rpm === p.r}
            className={`rounded-xl border px-3 py-3 text-sm transition ${rpm === p.r ? 'border-ice bg-ice/10 text-ice' : 'border-white/10 text-ti hover:border-white/30'}`}>
            <span className="block font-medium">{p.l}</span><span className="font-mono text-xs">{p.r.toLocaleString('en-US')} RPM</span>
          </button>
        ))}
      </div>
      <div className="mt-5 overflow-hidden rounded-xl border border-white/10 bg-[#05070a]">
        <canvas ref={wave} width={960} height={90} className="block w-full" aria-label="Live waveform" />
        <canvas ref={spec} width={960} height={170} className="block w-full" aria-label="Live spectrogram, 0 to 3 kHz" />
      </div>
      <p className="mt-3 text-xs leading-relaxed text-ti/80">
        Real-time physical synthesis from the CAD pipe network. The S58 is an inline-6: “V12” mode emulates 12 firing pulses per cycle through the same exhaust, it does not turn the engine into a V12. Stock is an approximation (no loop, 6 pulses).
      </p>
    </div>
  );
}
