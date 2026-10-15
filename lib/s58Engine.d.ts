export interface S58 {
  rpm: number; pedal: number; load: number; gear: number; v: number; ang: number; vol: number;
  valve: 'auto' | 'open' | 'closed'; v12: boolean; pops: boolean; cabin: boolean;
  onFire: null | ((cyl: number, bank: number, rpm: number) => void);
  process(left: Float32Array, right: Float32Array, n: number): void;
  setComp(loopMm: number, upstreamMm: number): void;
  reset(): void;
}
export default function S58Engine(sampleRate: number): S58;
