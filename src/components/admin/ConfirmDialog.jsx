import { useEffect } from 'react'

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
  useEffect(() => {
    if (!aberto) return
    function onKeyDown(e) {
      if (e.key === 'Escape') onCancelar()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [aberto, onCancelar])

  if (!aberto) return null

  return (
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
          <button type="button" className="btn btn--outline" onClick={onCancelar} disabled={confirmando}>
            Não
          </button>
          <button type="button" className="btn confirm-dialog__btn-confirmar" onClick={onConfirmar} disabled={confirmando}>
            {confirmando ? textoConfirmando : 'Sim'}
          </button>
        </div>
      </div>
    </div>
  )
}
