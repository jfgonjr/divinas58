'use client';
import dynamic from 'next/dynamic';

const ModelViewer = dynamic(() => import('./ModelViewer'), {
  ssr: false,
  loading: () => <div className="mx-auto flex h-[400px] max-w-7xl items-center justify-center font-mono text-sm text-ti">Loading 3D showroom…</div>,
});
export default function ViewerLoader() { return <ModelViewer />; }
