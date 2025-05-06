import { defineConfig } from 'vite'
import deno from '@deno/vite-plugin'
import react from '@vitejs/plugin-react'

const cert: string = await Deno.readTextFile('./certs/cert.pem');
const key: string = await Deno.readTextFile('./certs/key.pem');

// https://vite.dev/config/
export default defineConfig({
  plugins: [deno(), react()],
  build: {
    outDir: '../../dist', // Output to ../dist relative to frontend dir
    emptyOutDir: true,
  },
  resolve: {
    dedupe: ['@react-three/fiber', 'three'],
  },
})
