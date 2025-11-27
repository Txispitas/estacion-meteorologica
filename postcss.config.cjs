module.exports = {
  plugins: [
    // ⭐️ CORRECCIÓN DEFINITIVA: Usamos el paquete oficial de PostCSS.
    require('@tailwindcss/postcss'),
    require('autoprefixer'),
  ]
}