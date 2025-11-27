import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// El nombre del repositorio
const REPO_NAME = 'estacion-meteorologica'; 

export default defineConfig({
  // Establece la base pública para la construcción (CRUCIAL para gh-pages)
  base: `/${REPO_NAME}/`, 
  plugins: [react()],
})