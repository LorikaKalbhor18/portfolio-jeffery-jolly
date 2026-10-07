import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const formEndpoint = env.VITE_FORM_ENDPOINT ?? ''

  // Extract path from endpoint e.g. https://formspree.io/f/xgaooakr -> /f/xgaooakr
  let proxyTarget = ''
  let proxyRewrite = ''
  if (formEndpoint) {
    const url = new URL(formEndpoint)
    proxyTarget = url.origin
    proxyRewrite = url.pathname
  }

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      proxy: proxyTarget
        ? {
            '/api/contact': {
              target: proxyTarget,
              changeOrigin: true,
              rewrite: () => proxyRewrite,
            },
          }
        : {},
    },
    resolve: {
      alias: {
        '@': `${import.meta.dirname}/src`,
      },
    },
  }
})
