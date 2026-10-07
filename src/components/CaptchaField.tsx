import { captchaEnabled } from '@/hooks/useCaptcha'

export function CaptchaField({
  containerRef,
  error,
}: {
  containerRef: (node: HTMLDivElement | null) => void
  error: string
}) {
  if (!captchaEnabled) return null

  return (
    <div className="space-y-1">
      <div ref={containerRef} className="flex min-h-[65px] justify-center" />
      {error && (
        <p role="alert" className="text-center text-xs text-[#E5484D]">
          {error}
        </p>
      )}
    </div>
  )
}
