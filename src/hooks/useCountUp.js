import { useEffect, useRef, useState } from 'react'

// Anima um número subindo de 0 até `valor` — usado nos cards de estatística
// do painel admin. Refaz a contagem sempre que `valor` muda.
export function useCountUp(valor, duracaoMs = 900) {
  const [atual, setAtual] = useState(0)
  const frameRef = useRef(null)

  useEffect(() => {
    const inicio = performance.now()
    const para = Number(valor) || 0

    function tick(agora) {
      const progresso = Math.min((agora - inicio) / duracaoMs, 1)
      const suavizado = 1 - Math.pow(1 - progresso, 3)
      setAtual(para * suavizado)
      if (progresso < 1) frameRef.current = requestAnimationFrame(tick)
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [valor, duracaoMs])

  return atual
}