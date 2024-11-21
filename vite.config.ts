import path from 'path'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [react()],
    base: '/',
    build: {
        outDir: 'dist',
        assetsDir: 'assets'
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        },
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.json']
    },
    server: {
        port: 3001,
        proxy: {
            // Add proxy configuration if needed
        }
    }
})
