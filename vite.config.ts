import { defineConfig, loadEnv, type ProxyOptions } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const formEndpoint = env.VITE_FORM_ENDPOINT ?? ''

  const proxy: Record<string, ProxyOptions> = {}
  if (formEndpoint) {
    const url = new URL(formEndpoint)
    proxy['/api/contact'] = {
      target: url.origin,
      changeOrigin: true,
      rewrite: () => url.pathname,
    }
  }

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      proxy,
    },
    resolve: {
      alias: {
        '@': `${import.meta.dirname}/src`,
      },
    },
  }
})
