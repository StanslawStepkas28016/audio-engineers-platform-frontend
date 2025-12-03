import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path";

export default defineConfig({
/*    server: {
        host: true,
        proxy: {
            '/api': {
                target: 'http://127.0.0.1:5181', // your Mac’s IP + API port
                changeOrigin: true,
                secure: false,
            },
        },
    },*/

    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    plugins: [react(),
        tailwindcss()],
})
