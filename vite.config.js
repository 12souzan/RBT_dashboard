import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  css: {
    postcss: {}
  },
  define: {
    'process.env': {},
  },
  server: {
    port: 5174,
     host: true,
     strictPort: false, 
     open:false ,
  },
  plugins: [react(), tailwindcss()]
})