# Divina S58 Equal Length V12-Sound Exhaust System — Landing Page

Next.js 14 (App Router, TypeScript) · Tailwind · Framer Motion · React Three Fiber · Web Audio.
Site is pure black (`#000`), brand is **Divina** (cursive wordmark, font Great Vibes via `next/font`) with the ice-white flower mark (`components/Flor.tsx`).

## Tabs
- **Overview** (`/`): hero + audio player, acoustic physics, 3D CAD showroom, diagnostics, specs, CTA.
- **Simulator** (`/simulator`): your original simulator, translated to English and served from `public/simulator.html` inside an iframe.
  The sound engine inside it is byte-identical to the original (`lib/s58Engine.js` is the same code, used by the hero player).

## Run locally
```bash
npm install
npm run dev     # http://localhost:3000
```

## Deploy to Vercel
1. Push this folder to a GitHub repo (`git init && git add . && git commit -m "init" && git push`).
2. On vercel.com → **Add New → Project** → import the repo. Framework preset: **Next.js** (auto-detected). No env vars, no config.
3. Click **Deploy**. Or from the CLI: `npm i -g vercel && vercel --prod`.

## Edit
- Contact e-mail for the inquiry form: `CONTACT_EMAIL` in `components/Footer.tsx`. Social links: same file.
- 3D model: replace `public/models/assembly_S58_2tips.glb` (hotspot/camera coordinates are in CAD mm in `components/ModelViewer.tsx`).
- Flower colours: `--f1` / `--f2` in `app/globals.css`.
