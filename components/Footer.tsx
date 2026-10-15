'use client';
import { useState } from 'react';
import { X } from 'lucide-react';
import Flor from './Flor';
import Reveal from './Reveal';

const CONTACT_EMAIL = 'jun9nho@gmail.com';

export default function Footer() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const body = `Name: ${d.name}\nEmail: ${d.email}\nModel: ${d.car}\n\n${d.msg}`;
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Divina S58 Exhaust (concept model) inquiry')}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };
  const field = 'mt-1 w-full rounded-lg border border-white/15 bg-black px-3 py-2 text-ice outline-none focus:border-ice2';

  return (
    <footer className="border-t border-white/10">
      <section className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6">
        <Reveal>
          <Flor size={56} className="mx-auto" /><p className="mt-3 font-script text-5xl text-ice">Divina</p>
          <h2 className="mt-4 text-3xl font-black text-ice sm:text-5xl">Get in touch.</h2>
          <p className="mx-auto mt-4 max-w-xl text-ti">This is a design and CAD concept only: the Divina S58 exhaust is a model and is not manufactured or for sale. Questions, feedback and collaboration ideas are welcome by email.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button onClick={() => { setOpen(true); setSent(false); }} className="rounded-full bg-ice px-7 py-3 font-semibold text-black transition hover:scale-105">Pre-order / Inquiry</button>
          </div>
        </Reveal>
      </section>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 px-4 py-6 text-xs text-ti sm:px-6">
        <span>© {new Date().getFullYear()} Divina Performance Exhausts. Concept model only, not for sale. Not affiliated with BMW AG.</span>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Pre-order inquiry" onClick={() => setOpen(false)}>
          <div className="panel relative w-full max-w-md bg-black p-6" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpen(false)} aria-label="Close" className="absolute right-4 top-4 text-ti hover:text-ice"><X size={18} /></button>
            <h3 className="text-xl font-bold text-ice">Pre-order / Inquiry</h3>
            <p className="mt-2 rounded-lg border border-bank2/40 bg-bank2/10 p-3 text-xs text-ice">Please note: this is only a design model. I do not have the means to manufacture it, so no orders can be taken. Your message goes straight to my email.</p>
            {sent ? <p className="mt-4 text-ti">Your email app should have opened with the message ready to send. Thank you!</p> : (
              <form onSubmit={submit} className="mt-4 space-y-3 text-sm text-ti">
                <label className="block">Name<input name="name" required className={field} /></label>
                <label className="block">Email<input name="email" type="email" required className={field} /></label>
                <label className="block">Vehicle<select name="car" className={field}><option>BMW M3 G80</option><option>BMW M4 G82</option><option>Other S58</option></select></label>
                <label className="block">Message<textarea name="msg" rows={3} className={field} /></label>
                <button className="w-full rounded-full bg-ice py-3 font-semibold text-black">Send inquiry</button>
              </form>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}
