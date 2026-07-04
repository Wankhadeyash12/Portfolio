/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // These point at CSS custom properties (see src/index.css) instead of
        // fixed hex codes, so the admin panel can change the site's colors
        // at runtime (no rebuild needed) by writing new values onto
        // document.documentElement via the ThemeContext.
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        dark: 'var(--color-dark)',
        surface: 'var(--color-surface)',
        card: 'var(--color-card)',
        border: 'var(--color-border)',
        muted: 'var(--color-muted)',
      },
      fontFamily: {
        sans: ['Segoe UI', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
