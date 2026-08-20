import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig(() => {
  return {
    base: "/spravki/",
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
      host: "0.0.0.0",
      port: 4000
    }
  }
})
