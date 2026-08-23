import { defineConfig, loadEnv } from "vite"
import { fileURLToPath } from "url"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

const root = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, root)
  const AUTH_API_URL = env.VITE_AUTH_FRONTEND_URL

  return {
    base: "/",
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'vite-log-requests',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            console.log(`[vite] ${req.method} ${req.url}`)
            next()
          })
        }
      }
    ],
    server: {
      allowedHosts: [
        '*'
      ],
      host: "0.0.0.0",
      port: 4000,
      proxy: {
        "/api": {
          target: "http://localhost:8000",
          changeOrigin: true
        }
      }
    }
  }
})
