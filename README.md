# Simón Ocampo — Portafolio

**Software, investigación y diseño con enfoque humano.**

Portafolio web bilingüe (ES/EN) con proyectos de desarrollo, competencias técnicas y publicaciones en filosofía de la religión y teología analítica.

## 🚀 Características

- **Bilingüe de verdad** — el cambio de idioma también intercambia las portadas de cada proyecto, no solo los textos.
- **Carruseles horizontales** — navegación con la rueda del mouse dentro del área del carrusel, sin robarle el scroll a la página.
- **Lightbox de imagen y video** — pantalla completa con controles de reproducción y vista horizontal optimizada en móvil.
- **Scroll y animación** — Lenis para el desplazamiento, GSAP para las revelaciones.
- **Formulario de contacto sin backend propio** — función serverless en Vercel.
- **CV descargable** en ambos idiomas.

## 📂 Estructura

```
index.html            Página única
assets/css/           input.css (fuente Tailwind) → styles.css (compilado)
assets/js/main.js     i18n, carruseles, lightbox, GSAP y Lenis
assets/cv/            cv-es.pdf · cv-en.pdf
api/send-email.js     Función serverless del formulario de contacto
vercel.json           Configuración de despliegue
```

## 🛠️ Stack

HTML5 · Tailwind CSS · JavaScript · GSAP · Lenis · Vercel Serverless Functions · Tipografías Syne y Space Grotesk

## 💻 Puesta en marcha

```bash
git clone https://github.com/SimonOcampo1/professional-portfolio.git
cd professional-portfolio
npm install
npm run watch:css     # recompila Tailwind al vuelo
```

Con el CSS compilado, servir la carpeta (`python -m http.server 8000`) o abrir `index.html`. Para producción: `npm run build:css`.
