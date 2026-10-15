import { Linkedin, Mail } from 'lucide-react';

const btn = 'inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-black/70 px-3 py-1 text-[10px] font-medium text-white/80 backdrop-blur transition hover:border-ice hover:text-ice sm:text-xs';

/** Credit watermark + contact buttons, anchored in the bottom-right corner at the end of every page (does not float over the content). */
export default function Watermark() {
  return (
    <div aria-label="Credits" className="ml-auto max-w-sm select-none px-4 py-4 text-right text-[11px] leading-snug text-white/50 sm:px-6">
      <p>Made by <span className="font-semibold text-white/70">Jose Francisco Gonçalves Junior</span></p>
      <p>Engineering student in Instrumentation, Automation and Robotics at UFABC</p>
      <p>Industrial Automation • CAD • Numerical Simulation • Python and C/C++</p>
      <div className="mt-1.5 flex justify-end gap-2">
        <a href="mailto:jun9nho@gmail.com" className={btn} aria-label="Send an email to Jose Francisco Gonçalves Junior"><Mail size={13} /> Email</a>
        <a href="https://www.linkedin.com/in/jfgonjr" target="_blank" rel="noopener noreferrer" className={btn} aria-label="Open LinkedIn profile"><Linkedin size={13} /> LinkedIn</a>
      </div>
    </div>
  );
}
