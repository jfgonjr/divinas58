'use client';
import { Component, Suspense, useRef, useState, type ReactNode } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Html, Lightformer, OrbitControls, useGLTF } from '@react-three/drei';
import { RotateCw } from 'lucide-react';
import Reveal from './Reveal';

const MODEL_URL = '/models/assembly_S58_2tips.glb';
/* CAD frame: X back, Y left, Z up (mm) -> scene frame (m): x, z, -y, centred on the model */
const cad = (x: number, y: number, z: number): [number, number, number] => [(x - 1810.5) / 1000, (z - 257.4) / 1000, -y / 1000];

type View = { pos: [number, number, number]; target: [number, number, number] };
const VIEWS: Record<string, View> = {
  'Full System': { pos: [1.6, 2.1, 3.9], target: [0, 0, 0] },
  'Equalization Loop': { pos: [-0.9, 1.0, 0.1], target: cad(900, 130, 180) },
  'X-Pipe': { pos: [0.35, 0.8, 0.8], target: cad(1760, 0, 180) },
  'Dual Tips': { pos: [2.7, 0.55, 1.1], target: cad(3600, 0, 210) },
};
const HOTSPOTS = [
  { id: 1, color: '#00f0ff', pos: cad(900, 200, 200), view: 'Equalization Loop', title: 'Bank 1 Equalization Loop (+330 mm)', text: 'Two-lobe omega serpentine adds exactly 330.0 mm to Bank 1 so both banks arrive at the X-pipe in phase.' },
  { id: 2, color: '#EAF6FF', pos: cad(1760, 0, 190), view: 'X-Pipe', title: '18° High-Velocity X-Pipe Crossover', text: 'Oval-fused crossover with polished sleeve. Interleaves both banks into a clean 120° pulse train.' },
  { id: 3, color: '#ff2e63', pos: cad(2300, 200, 200), view: 'Full System', title: 'Dual Telescopic 650 mm J-Pipes', text: 'Blind Helmholtz branches, tuned to a quarter wavelength at ≈204 Hz to cancel cabin drone.' },
  { id: 4, color: '#94a3b8', pos: cad(3690, 0, 270), view: 'Dual Tips', title: 'Dual 114 mm (4.5") Carbon / Titanium Tailpipes', text: 'Ti liner Ø101.6 mm with carbon-fibre sleeve, 15° slash cut, 40 mm gap. Divina script laser-engraved on the sleeve (the CAD file still carries a generic placeholder engraving).' },
];

function Model() {
  const { scene } = useGLTF(MODEL_URL);
  scene.traverse((o) => {
    if (o.name.startsWith('REF_')) o.visible = false; // CAD reference placeholder, not part of the product
    const m = (o as THREE.Mesh).material as THREE.MeshStandardMaterial | undefined;
    if (m && 'metalness' in m && !(m as THREE.Material).transparent) { m.metalness = 0.85; m.roughness = 0.32; m.envMapIntensity = 1.2; }
  });
  return <group scale={0.001} position={[-1.8105, -0.2574, 0]}><primitive object={scene} /></group>;
}

/* Fallback geometry when the .glb is missing */
function Placeholder() {
  const tube = (y: number, c: string) => (
    <group key={y}>
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0, 0, y]}><cylinderGeometry args={[0.032, 0.032, 3.6, 32]} /><meshStandardMaterial color={c} metalness={0.9} roughness={0.3} /></mesh>
      <mesh rotation={[0, 0, Math.PI / 2]} position={[1.75, 0, y * 0.6]}><cylinderGeometry args={[0.057, 0.057, 0.2, 32]} /><meshStandardMaterial color="#111" metalness={0.5} roughness={0.4} /></mesh>
    </group>
  );
  return <group>{tube(-0.08, '#94a3b8')}{tube(0.08, '#94a3b8')}</group>;
}

class Boundary extends Component<{ children: ReactNode; fallback: ReactNode }, { err: boolean }> {
  state = { err: false };
  static getDerivedStateFromError() { return { err: true }; }
  render() { return this.state.err ? this.props.fallback : this.props.children; }
}

function Rig({ goal, clear }: { goal: View | null; clear: () => void }) {
  const { camera, controls } = useThree();
  useFrame((_, dt) => {
    const c = controls as unknown as { target: THREE.Vector3; update: () => void } | null;
    if (!goal || !c) return;
    const k = 1 - Math.exp(-dt * 4), p = new THREE.Vector3(...goal.pos), t = new THREE.Vector3(...goal.target);
    camera.position.lerp(p, k); c.target.lerp(t, k); c.update();
    if (camera.position.distanceTo(p) < 0.01) clear();
  });
  return null;
}

export default function ModelViewer() {
  const [goal, setGoal] = useState<View | null>(null);
  const [spin, setSpin] = useState(true);
  const [active, setActive] = useState<number | null>(1);
  const [view, setView] = useState('Full System');
  const go = (name: string) => { setView(name); setGoal(VIEWS[name]); setSpin(false); };
  const hs = HOTSPOTS.find((h) => h.id === active);
  const wrap = useRef<HTMLDivElement>(null);

  return (
    <section id="cad" className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <Reveal><p className="eyebrow">03 · Interactive 3D CAD showroom</p><h2 className="mt-3 max-w-3xl text-3xl font-black text-ice sm:text-5xl">Every weld, in 360°.</h2></Reveal>
      <div className="panel mt-10 overflow-hidden">
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 p-3">
          {Object.keys(VIEWS).map((n) => (
            <button key={n} onClick={() => go(n)} aria-pressed={view === n} className={`rounded-full border px-4 py-1.5 text-sm transition ${view === n ? 'border-ice bg-ice text-black' : 'border-white/15 text-ti hover:text-ice'}`}>{n}</button>
          ))}
          <button onClick={() => setSpin((s) => !s)} aria-pressed={spin} className={`ml-auto inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm ${spin ? 'border-bank1 text-bank1' : 'border-white/15 text-ti'}`}><RotateCw size={14} /> Auto-rotate</button>
        </div>
        <div ref={wrap} className="relative h-[460px] w-full sm:h-[600px]">
          <Canvas camera={{ position: VIEWS['Full System'].pos, fov: 32, near: 0.05, far: 50 }} dpr={[1, 2]}>
            <color attach="background" args={['#000000']} />
            <ambientLight intensity={0.25} />
            <directionalLight position={[3, 5, 2]} intensity={1.4} />
            <Environment resolution={256}>
              <Lightformer form="rect" intensity={3} position={[0, 5, 0]} rotation-x={Math.PI / 2} scale={[12, 6, 1]} />
              <Lightformer form="rect" intensity={2} position={[-5, 1, -2]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} color="#8FD3F4" />
              <Lightformer form="rect" intensity={2} position={[5, 1, 2]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} color="#ffffff" />
            </Environment>
            <Boundary fallback={<Placeholder />}>
              <Suspense fallback={null}><Model /></Suspense>
            </Boundary>
            {HOTSPOTS.map((h) => (
              <Html key={h.id} position={h.pos} center zIndexRange={[20, 0]}>
                <button onClick={() => { setActive(h.id); go(h.view); }} aria-label={h.title}
                  className="grid h-7 w-7 place-items-center rounded-full border-2 font-mono text-xs font-bold text-black shadow-[0_0_18px_currentColor] transition hover:scale-125"
                  style={{ background: h.color, color: h.color, borderColor: '#000' }}><span className="text-black">{h.id}</span></button>
              </Html>
            ))}
            <Rig goal={goal} clear={() => setGoal(null)} />
            <OrbitControls makeDefault enableDamping autoRotate={spin} autoRotateSpeed={0.6} minDistance={0.4} maxDistance={8} onStart={() => setGoal(null)} />
          </Canvas>
          {hs && (
            <div className="pointer-events-none absolute bottom-4 left-4 right-4 max-w-md rounded-xl border border-white/10 bg-black/80 p-4 backdrop-blur sm:right-auto">
              <p className="font-mono text-xs" style={{ color: hs.color }}>HOTSPOT {hs.id}</p>
              <p className="mt-1 font-bold text-ice">{hs.title}</p>
              <p className="mt-1 text-sm text-ti">{hs.text}</p>
            </div>
          )}
        </div>
        <p className="border-t border-white/10 p-3 text-xs text-ti/70">Drag to orbit · scroll to zoom · tap a numbered hotspot. Model: CAD export (CadQuery / OpenCascade), placeholder fitment dimensions.</p>
      </div>
    </section>
  );
}
