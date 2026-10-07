import { useCallback, useRef, useState } from 'react'

const provider = import.meta.env.VITE_CAPTCHA_PROVIDER?.trim() ?? ''
const siteKey = import.meta.env.VITE_CAPTCHA_SITE_KEY?.trim() ?? ''

export const captchaEnabled = Boolean(provider && siteKey)

type HCaptcha = {
  render: (el: HTMLDivElement, opts: object) => number
  reset: (id: number) => void
}

function getHCaptcha(): HCaptcha | undefined {
  return (window as unknown as Record<string, unknown>)['hcaptcha'] as HCaptcha | undefined
}

function waitForHCaptcha(timeout = 10_000): Promise<HCaptcha> {
  return new Promise((resolve, reject) => {
    // Inject script if not already present
    if (!document.querySelector('script[src*="hcaptcha.com"]')) {
      const script = document.createElement('script')
      script.src = 'https://js.hcaptcha.com/1/api.js'
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }

    const start = Date.now()
    const interval = window.setInterval(() => {
      const h = getHCaptcha()
      if (h) {
        window.clearInterval(interval)
        resolve(h)
      } else if (Date.now() - start > timeout) {
        window.clearInterval(interval)
        reject(new Error('hCaptcha script did not load'))
      }
    }, 50)
  })
}

export function useCaptcha() {
  const [token, setToken] = useState('')
  const widgetId = useRef<number | null>(null)
  const containerNode = useRef<HTMLDivElement | null>(null)

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    containerNode.current = node
    if (!captchaEnabled || !node || provider !== 'hcaptcha') return

    waitForHCaptcha()
      .then((hcaptcha) => {
        if (!containerNode.current) return
        widgetId.current = hcaptcha.render(containerNode.current, {
          sitekey: siteKey,
          callback: (t: string) => setToken(t),
          'expired-callback': () => setToken(''),
          'error-callback': () => setToken(''),
        })
      })
      .catch(() => {
        // script failed to load — form still works, CAPTCHA silently skipped
      })
  }, [])

  const reset = useCallback(() => {
    setToken('')
    if (widgetId.current === null || !captchaEnabled) return
    getHCaptcha()?.reset(widgetId.current)
  }, [])

  return { containerRef, token, reset }
}
