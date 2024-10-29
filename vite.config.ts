import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const basenameProd = '/polymarket-research-ui'

export default defineConfig(({ command }) => {
    return {
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
            port: 3000,
            proxy: {
                // Add proxy configuration if needed
            }
        }
    }
})
