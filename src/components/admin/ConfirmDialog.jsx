import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

// Modal de confirmação genérico — usado no lugar do window.confirm nativo
// pra manter a identidade visual do painel admin.
export default function ConfirmDialog({
  aberto,
  titulo,
  mensagem,
  onConfirmar,
  onCancelar,
  confirmando,
  textoConfirmando = 'Excluindo...',
}) {
  const cancelarRef = useRef(null)

  useEffect(() => {
    if (!aberto) return

    function onKeyDown(e) {
      if (e.key === 'Escape') onCancelar()
    }
    window.addEventListener('keydown', onKeyDown)

    // Sem travar o body, no celular o dedo arrastava a página inteira atrás
    // do modal — a pessoa perdia os botões Sim/Não de vista sem ter
    // respondido nada.
    const overflowAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Foco no "Não": ação destrutiva nunca começa selecionada, então um
    // Enter distraído cancela em vez de excluir.
    const focoAnterior = document.activeElement
    cancelarRef.current?.focus()

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = overflowAnterior
      if (focoAnterior instanceof HTMLElement) focoAnterior.focus()
    }
  }, [aberto, onCancelar])

  if (!aberto) return null

  return createPortal(
    <div className="confirm-dialog__overlay" onClick={onCancelar}>
      <div
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-titulo"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="confirm-dialog-titulo">{titulo}</h3>
        <p>{mensagem}</p>
        <div className="confirm-dialog__acoes">
          <button
            ref={cancelarRef}
            type="button"
            className="btn btn--outline"
            onClick={onCancelar}
            disabled={confirmando}
          >
            Não
          </button>
          <button type="button" className="btn confirm-dialog__btn-confirmar" onClick={onConfirmar} disabled={confirmando}>
            {confirmando ? textoConfirmando : 'Sim'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
