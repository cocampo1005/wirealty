// Tailwind CSS 4 runs as a PostCSS plugin, which both Webpack (production
// builds) and Turbopack (local dev) pick up automatically.
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

export default config
