'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Flor from './Flor';

const TABS = [{ href: '/', label: 'Overview' }, { href: '/simulator', label: 'Simulator' }];
const ANCHORS = [['#physics', 'Physics'], ['#cad', '3D CAD'], ['#diagnostics', 'Diagnostics'], ['#specs', 'Specs']];

export default function SiteNav() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3" aria-label="Home">
          <Flor size={34} />
          <span className="font-script text-4xl leading-none text-ice">Divina</span>
        </Link>
        <nav className="ml-auto flex items-center gap-1" aria-label="Main tabs">
          {TABS.map((t) => {
            const active = path === t.href;
            return (
              <Link key={t.href} href={t.href} aria-current={active ? 'page' : undefined}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${active ? 'bg-ice text-black' : 'text-ti hover:text-ice'}`}>
                {t.label}
              </Link>
            );
          })}
        </nav>
        {path === '/' && (
          <nav className="hidden items-center gap-5 text-sm text-ti lg:flex" aria-label="Sections">
            {ANCHORS.map(([h, l]) => <a key={h} href={h} className="hover:text-ice">{l}</a>)}
          </nav>
        )}
      </div>
    </header>
  );
}
