# Issa — Portfolio

Terminal-Boot-Ästhetik, 3D-Charakter materialisiert sich scroll-gesteuert. React + TypeScript + Three.js + Vite.

## Setup

```bash
npm install
npm run dev
```

## Dein 3D-Charakter einbinden

Deine hochgeladenen Dateien (`base_basic_pbr.glb`, `base_basic_shaded.glb`) sind mit ~1 Mio.
Dreiecken und 46 MB weit zu groß für Web-Echtzeit-Rendering — v.a. auf iOS, wo Safari bei zu
hohem GPU-Speicherverbrauch die Seite killt (weißer Bildschirm).

**1. Geometrie reduzieren (Blender, kostenlos):**
Import GLB → Modifier "Decimate" → Verhältnis ~0.05 (≈ 50k Tris) → Export als GLB.

**2. Komprimieren:**
```bash
npm install -g @gltf-transform/cli
gltf-transform optimize base_basic_pbr_decimated.glb public/models/character.glb \
  --compress draco \
  --texture-compress webp
```
Erwartung: 46 MB → ca. 2–4 MB.

**3. Ablegen:**
Die fertige Datei kommt nach `public/models/character.glb` — der Pfad ist in
`src/components/Hero.tsx` bereits verdrahtet.

## iOS-Optimierungen, die bereits eingebaut sind

- `devicePixelRatio` auf 2 gedeckelt (iPhones melden teils 3 → unnötiger Fill-Rate-Kosten)
- WebGL-Context-Loss-Handling (Safari killt den Context bei Speicherdruck / App-Switch)
- Rendering pausiert, wenn Tab im Hintergrund ist oder die Szene außerhalb des Viewports ist
- Manuelles Dispose von Geometrien/Texturen beim Unmount (Safaris WebGL-GC ist träge)
- `100dvh` statt `100vh` (iOS-Toolbar verändert sonst die Höhe während des Scrollens)
- `env(safe-area-inset-*)` für Notch/Home-Indicator
- Kein `user-scalable=no` (Accessibility) — Doppel-Tap-Zoom stattdessen über `touch-action`
  unterbunden
- `prefers-reduced-motion` wird respektiert

## Noch offen

- `src/components/Contact.tsx`: echte E-Mail/Links eintragen
- `public/models/character.glb`: optimiertes Modell nachreichen (siehe oben)
- Favicon / OpenGraph-Bild ergänzen
