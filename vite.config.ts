import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // For GitHub Pages project site: https://<user>.github.io/<repo>/
  // Set base to '/<repo>/' so built asset URLs are correct.
  base: '/m3nu4nimation/',
})
