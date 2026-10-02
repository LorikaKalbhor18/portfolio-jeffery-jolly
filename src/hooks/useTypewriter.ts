import { useState, useEffect, useRef } from 'react'

export function useTypewriter(words: string[], speed = 70, pause = 1800, deleteSpeed = 40) {
  const [displayed, setDisplayed] = useState('')
  const [wordIndex, setWordIndex] = useState(0)
  const [phase, setPhase] = useState<'typing' | 'pausing' | 'deleting'>('typing')
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (words.length === 0) {
      setDisplayed('')
      return
    }

    const word = words[wordIndex % words.length]

    if (phase === 'typing') {
      if (displayed.length < word.length) {
        timeout.current = setTimeout(
          () => setDisplayed(word.slice(0, displayed.length + 1)),
          speed
        )
      } else {
        timeout.current = setTimeout(() => setPhase('pausing'), pause)
      }
    } else if (phase === 'pausing') {
      timeout.current = setTimeout(() => setPhase('deleting'), 0)
    } else {
      if (displayed.length > 0) {
        timeout.current = setTimeout(
          () => setDisplayed(displayed.slice(0, -1)),
          deleteSpeed
        )
      } else {
        setWordIndex((i) => i + 1)
        setPhase('typing')
      }
    }

    return () => clearTimeout(timeout.current)
  }, [displayed, phase, wordIndex, words, speed, pause, deleteSpeed])

  return displayed
}
