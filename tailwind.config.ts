import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: { obsidian: '#000000', ti: '#94a3b8', bank1: '#00f0ff', bank2: '#ff2e63', ice: '#EAF6FF', ice2: '#8FD3F4' },
      fontFamily: { sans: ['var(--font-sans)', 'system-ui', 'sans-serif'], mono: ['var(--font-mono)', 'ui-monospace', 'monospace'], script: ['var(--font-script)', 'cursive'] },
    },
  },
  plugins: [],
};
export default config;
