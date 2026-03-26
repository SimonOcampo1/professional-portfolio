# SIMÓN OCAMPO | TECHNICAL MANIFEST v2.0

> "Systems & Arguments."

A high-performance, **fully responsive**, **bilingual** (English/Spanish) portfolio engineered for precision, utilizing a custom design system ("The Curated Void") that prioritizes typography, negative space, and zero-latency interactions.

## 01 / FEATURES

### Architecture
- **Atomic Design System**: Component-based architecture with strict tonal hierarchy.
- **Zero-Border Radius**: Editorial aesthetic with sharp 0px corners throughout.
- **Fully Responsive Grid**: Optimized for mobile, tablet, and desktop with fluid layouts using CSS Grid and Tailwind responsive utilities.
- **Bilingual Support**: Complete English/Spanish translation system with persistent language preference.

### Performance
- **Lenis Smooth Scroll**: Virtualized scrolling for a premium, heavy feel with anchor link navigation.
- **GSAP ScrollTrigger**: High-performance, GPU-accelerated reveal animations.
- **Mobile-First Design**: Touch-optimized with responsive typography maintaining visual impact.

### Interactivity
- **Theme Switcher**: Light/Dark mode with localStorage persistence.
- **Language Toggle**: EN/ES switcher with real-time content updates.
- **Mobile Navigation**: Full-screen overlay menu with smooth transitions.
- **Smooth Scrolling**: Custom scroll physics on all anchor links.

## 02 / FILE STRUCTURE

```bash
portfolio-aesthetic/
├── assets/
│   ├── css/
│   │   ├── input.css       # Tailwind source
│   │   └── styles.css      # Compiled production CSS
│   ├── js/
│   │   └── main.js         # GSAP, Lenis, Theme & Language system
│   └── images/             # Design assets
├── index.html              # Main entry point (with i18n attributes)
├── tailwind.config.js      # Design system configuration
└── package.json            # Dependency manifest
```

## 03 / TECH STACK

- **Core**: HTML5, Vanilla JS (ES6+)
- **Styling**: Tailwind CSS v3.4 (Dark mode enabled)
- **Motion**: GSAP 3.12 (ScrollTrigger)
- **Interaction**: Lenis Scroll (Studio Freight)
- **Typography**: Manrope (Display), Inter (Body), Space Grotesk (Mono)
- **i18n**: Custom JavaScript translation system

## 04 / SETUP

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Develop (Watch Mode)**
   ```bash
   npm run watch:css
   ```

3. **Build for Production**
   ```bash
   npm run build:css
   ```

4. **Deploy**
   Upload the directory to Vercel, Netlify, or GitHub Pages. No build step required on server if `assets/css/styles.css` is committed.

## 05 / RESPONSIVE BREAKPOINTS

- **Mobile**: < 768px (Single column, stacked layout, 16vw hero text)
- **Tablet**: 768px - 1024px (2 columns, 14vw hero text)
- **Desktop**: > 1024px (4 columns on stack grid, 12vw hero text)

## 06 / BILINGUAL CONTENT

All content is translatable via the `data-i18n` attribute system:
- Navigation menu items
- Hero section (title, CTA, description)
- Project titles and descriptions
- Research publications
- Contact section
- Footer

Language preference is stored in `localStorage` and persists across sessions.

---

© 2024 SIMÓN OCAMPO. All systems nominal.
