module.exports = {
  // ⭐️ CRUCIAL: Usamos notación de array y require() para cargar los plugins.
  // Esto resuelve el error de conflicto de carga de módulos en PostCSS/Vite.
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ]
}