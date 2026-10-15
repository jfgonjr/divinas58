import type { Metadata } from 'next';
import { ExternalLink } from 'lucide-react';

export const metadata: Metadata = { title: 'Exhaust Sound Simulator — Divina S58' };

export default function SimulatorPage() {
  return (
    <main className="flex h-[calc(100dvh-4rem)] flex-col bg-black">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-2 text-xs text-ti sm:px-6">
        <span>Click <b className="text-ice">Start audio</b> to begin · hold <kbd className="rounded border border-white/20 px-1">Space</kbd> to rev</span>
        <a href="/simulator.html" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-ice">
          Open full screen <ExternalLink size={12} />
        </a>
      </div>
      <iframe src="/simulator.html" title="S58 exhaust sound simulator" allow="autoplay; fullscreen" className="w-full flex-1 border-0 bg-black" />
    </main>
  );
}
