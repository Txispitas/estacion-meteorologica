import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // ⭐️ ÚLTIMA CORRECCIÓN: Cambiamos a './' para que las rutas de assets sean relativas
  // Esto es más robusto en entornos de subdirectorios como GitHub Pages.
  base: './', 
  plugins: [react()],
});