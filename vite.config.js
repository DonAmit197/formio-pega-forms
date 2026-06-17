import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from "@cloudflare/vite-plugin";
export default defineConfig({
    plugins: [tailwindcss(), cloudflare()],
    server: {
        host: true,
        port: 5000,
    },
})