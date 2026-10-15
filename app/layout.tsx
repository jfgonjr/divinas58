import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono, Great_Vibes } from 'next/font/google';
import SiteNav from '@/components/SiteNav';
import Watermark from '@/components/Watermark';
import './globals.css';

const sans = Inter({ subsets: ['latin'], variable: '--font-sans' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });
const script = Great_Vibes({ subsets: ['latin'], weight: '400', variable: '--font-script' });

export const metadata: Metadata = {
  title: 'Divina S58 Equal Length V12-Sound Exhaust System — BMW M3 G80 / M4 G82',
  description: 'Divina Performance Exhausts: Precision Acoustics for the BMW S58. Equal-length titanium exhaust for the S58 inline-6. Acoustic engineering, 3D CAD showroom and a physics-based sound simulator.',
};
export const viewport: Viewport = { themeColor: '#000000' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${script.variable}`}>
      <body className="bg-black font-sans antialiased">
        <SiteNav />
        {children}
        <Watermark />
      </body>
    </html>
  );
}
