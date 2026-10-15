'use client';
import { motion } from 'framer-motion';
import Flor from './Flor';
import AudioPlayer from './AudioPlayer';

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-20 text-center sm:px-6 sm:pt-28">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[820px] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(143,211,244,0.14),transparent)]" />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 0.6, 0.2, 1] }} className="relative mx-auto max-w-4xl">
        <Flor size={72} className="mx-auto" />
        <p className="eyebrow mt-8">Divina Performance Exhausts: Precision Acoustics for the BMW S58</p>
        <h1 className="mt-4 text-4xl font-black uppercase leading-[1.05] tracking-tight text-ice sm:text-6xl lg:text-7xl">
          <span className="font-script text-7xl font-normal normal-case sm:text-8xl lg:text-9xl">Divina</span><br />S58 <span className="text-bank1">Equal Length</span> V12-Sound Exhaust System
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-ti">
          Eradicating S58 asymmetry. Converting the 3.0L Twin-Turbo Inline-6 into a high-pitched 12-cylinder acoustic masterpiece. Engineered for the BMW M3 G80 / M4 G82.
        </p>
      </motion.div>
      <AudioPlayer />
    </section>
  );
}
