# SIMÓN OCAMPO | PORTAFOLIO PROFESIONAL

> "Software, investigación y diseño con enfoque humano."

Portafolio web responsivo y bilingüe (EN/ES) diseñado para exhibir proyectos de desarrollo, competencias técnicas y académicas, y publicaciones de investigación en filosofía de la religión y teología analítica.

## Funcionalidades

- **Navegación Fluida**: Implementación de scroll suave con Lenis y animaciones GSAP.
- **Carruseles Interactivos**: Navegación horizontal mediante scroll/rueda del ratón dentro del área del carrusel de cada proyecto.
- **Lightbox de Medios**: Visualización de imágenes y videos en pantalla completa con soporte responsivo (vista horizontal optimizada en móviles) y controles de reproducción.
- **Internacionalización (i18n)**: Soporte bilingüe completo que incluye el intercambio dinámico de portadas de proyectos según el idioma seleccionado.
- **Estética Premium**: Diseño de "lujo silencioso" con bordes redondeados pronunciados (`rounded-3xl`), micro-interacciones y tipografías modernas (Syne y Space Grotesk).

## Estructura del Proyecto

```bash
professional-portfolio/
├── assets/
│   ├── css/
│   │   ├── input.css        # Estilos fuente y configuraciones de Tailwind
│   │   └── styles.css       # CSS compilado y minificado para producción
│   ├── js/
│   │   └── main.js          # Lógica de i18n, carruseles, lightbox y animaciones
│   └── img/
│       ├── projects/        # Activos visuales (imágenes/videos) organizados por proyecto
│       └── ...              # Otros activos (logo, hero image)
├── index.html               # Estructura principal y marcado semántico
├── tailwind.config.js       # Configuración de diseño y tokens de Tailwind
├── package.json             # Dependencias y scripts de construcción
└── README.md                # Documentación del proyecto (Español)
```

## Stack Tecnológico

- **Core**: HTML5, Vanilla JavaScript (ES6+).
- **Estilos**: Tailwind CSS (Utilidades optimizadas).
- **Animaciones**: GSAP (GreenSock Animation Platform) + ScrollTrigger.
- **Motor de Scroll**: Lenis Smooth Scroll.
- **Iconografía**: Google Material Symbols.

## Configuración y Desarrollo

1. **Instalación**:
   ```bash
   npm install
   ```

2. **Compilación de Estilos (Tailwind)**:
   ```bash
   # Para desarrollo (modo observación)
   npm run watch:css
   
   # Para producción (minificado)
   npm run build:css
   ```

3. **Ejecución**:
   El proyecto es una aplicación estática. Puede servirse localmente con extensiones como "Live Server" en VS Code o desplegarse directamente en Vercel, Netlify o GitHub Pages.

---
*Diseñado y desarrollado por Simón Ocampo.*
