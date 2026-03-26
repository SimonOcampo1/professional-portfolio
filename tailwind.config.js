/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./assets/**/*.js"],
  darkMode: 'class', // Enable manual dark mode
  theme: {
    extend: {
      colors: {
        // Stark / Aura Monolith Palette
        'background': 'rgb(var(--background) / <alpha-value>)',
        'surface': 'rgb(var(--surface) / <alpha-value>)',
        'on-background': 'rgb(var(--on-background) / <alpha-value>)',
        'on-surface': 'rgb(var(--on-surface) / <alpha-value>)',
        'primary': 'rgb(var(--primary) / <alpha-value>)',
        'outline': 'rgb(var(--outline) / <alpha-value>)',

        // Legacy/Unmapped (kept for safety)
        'surface-dim': '#131313',
        'surface-bright': '#393939',
        'surface-container-lowest': '#0e0e0e',
        'surface-container-low': '#1b1b1b',
        'surface-container': '#1f1f1f',
        'surface-container-high': '#2a2a2a',
        'surface-container-highest': '#353535',
        'on-surface-variant': '#c6c6c6',
        'outline-variant': '#474747',
        'on-primary': '#1a1c1c',
        'primary-container': '#d4d4d4',
        'on-primary-container': '#000000',
        
        'secondary': '#c6c6c7',
        'on-secondary': '#1a1c1c',
        'secondary-container': '#454747',
        'on-secondary-container': '#e2e2e2',
        
        'tertiary': '#e2e2e2',
        'on-tertiary': '#1a1c1c',
        'tertiary-container': '#909191',
        'on-tertiary-container': '#000000',
        
        'error': '#ffb4ab',
        'on-error': '#690005',
        'error-container': '#93000a',
        'on-error-container': '#ffdad6',
        
        // Custom Accent from Hero
        'accent': '#7c9885',

        // Keep legacy void colors for safety during migration, mapped to new system where possible
        'void-black': '#131313', 
        'void-white': '#e2e2e2',
      },
      fontFamily: {
        headline: ['Syne', 'sans-serif'],
        body: ['Space Grotesk', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0px',
        'none': '0px',
        'sm': '0px',
        'md': '0px',
        'lg': '0px',
        'xl': '0px',
        '2xl': '0px',
        'full': '9999px', // Only exception per system
      },
      transitionTimingFunction: {
        'void': 'cubic-bezier(0.2, 1, 0.3, 1)',
      }
    },
  },
  plugins: [],
}
