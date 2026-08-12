import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { IconCheck, IconAlert, IconInfo } from '../components/icons'

const ToastContext = createContext(null)

const DURACAO_PADRAO_MS = 2800
// Mais de 3 avisos empilhados na tela viram ruído (e em celular cobrem a
// sacola inteira) — os mais antigos saem pra abrir espaço pro novo.
const MAX_VISIVEIS = 3

const ICONES = {
  sucesso: IconCheck,
  erro: IconAlert,
  info: IconInfo,
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const proximoId = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (mensagem, { tipo = 'info', duracao = DURACAO_PADRAO_MS } = {}) => {
      const id = (proximoId.current += 1)
      setToasts((prev) => [...prev.slice(-(MAX_VISIVEIS - 1)), { id, mensagem, tipo }])
      window.setTimeout(() => dismiss(id), duracao)
      return id
    },
    [dismiss],
  )

  const value = useMemo(() => ({ showToast, dismiss }), [showToast, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* aria-live="polite" pra que quem usa leitor de tela também receba a
          confirmação — o toast é a única resposta visual de "adicionei". */}
      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map(({ id, mensagem, tipo }) => {
          const Icone = ICONES[tipo] || ICONES.info
          return (
            <div key={id} className={`toast toast--${tipo}`}>
              <Icone className="toast__icon" aria-hidden="true" />
              <span>{mensagem}</span>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast precisa estar dentro de <ToastProvider>')
  return ctx
}
