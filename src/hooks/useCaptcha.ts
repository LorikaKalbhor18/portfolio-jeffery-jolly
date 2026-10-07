import { useCallback, useRef, useState } from 'react'

const provider = import.meta.env.VITE_CAPTCHA_PROVIDER?.trim() ?? ''
const siteKey = import.meta.env.VITE_CAPTCHA_SITE_KEY?.trim() ?? ''

export const captchaEnabled = Boolean(provider && siteKey)

/**
 * Returns a ref callback to mount the CAPTCHA widget into a container div,
 * the current token, and a reset function.
 *
 * When VITE_CAPTCHA_PROVIDER / VITE_CAPTCHA_SITE_KEY are not set the hook is
 * a no-op: containerRef is a no-op, token stays '', reset is a no-op.
 *
 * Supported providers (set VITE_CAPTCHA_PROVIDER to one of these strings):
 *   "hcaptcha"   — add hCaptcha script tag and extend CSP with hcaptcha.com
 *   "recaptcha"  — add reCAPTCHA v2/v3 script tag and extend CSP with google.com
 */
export function useCaptcha() {
  const [token, setToken] = useState('')
  const widgetId = useRef<number | null>(null)

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (!captchaEnabled || !node) return

    if (provider === 'hcaptcha') {
      const w = window as unknown as Record<string, unknown>
      const hcaptcha = w['hcaptcha'] as
        | { render: (el: HTMLDivElement, opts: object) => number; reset: (id: number) => void }
        | undefined
      if (!hcaptcha) return
      widgetId.current = hcaptcha.render(node, {
        sitekey: siteKey,
        callback: (t: string) => setToken(t),
        'expired-callback': () => setToken(''),
        'error-callback': () => setToken(''),
      })
    }

    if (provider === 'recaptcha') {
      const w = window as unknown as Record<string, unknown>
      const grecaptcha = w['grecaptcha'] as
        | { render: (el: HTMLDivElement, opts: object) => number; reset: (id: number) => void }
        | undefined
      if (!grecaptcha) return
      widgetId.current = grecaptcha.render(node, {
        sitekey: siteKey,
        callback: (t: string) => setToken(t),
        'expired-callback': () => setToken(''),
        'error-callback': () => setToken(''),
      })
    }
  }, [])

  const reset = useCallback(() => {
    setToken('')
    if (widgetId.current === null || !captchaEnabled) return
    const w = window as unknown as Record<string, unknown>
    if (provider === 'hcaptcha') {
      const hcaptcha = w['hcaptcha'] as { reset: (id: number) => void } | undefined
      hcaptcha?.reset(widgetId.current)
    }
    if (provider === 'recaptcha') {
      const grecaptcha = w['grecaptcha'] as { reset: (id: number) => void } | undefined
      grecaptcha?.reset(widgetId.current)
    }
  }, [])

  return { containerRef, token, reset }
}
