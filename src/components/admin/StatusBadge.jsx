const LABELS = {
  CRIADO: 'Criado',
  AGUARDANDO_PAGAMENTO: 'Aguardando',
  PAGO: 'Pago',
  CANCELADO: 'Cancelado',
}

const CLASSES = {
  CRIADO: 'admin-badge--criado',
  AGUARDANDO_PAGAMENTO: 'admin-badge--aguardando',
  PAGO: 'admin-badge--pago',
  CANCELADO: 'admin-badge--cancelado',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`admin-badge ${CLASSES[status] || 'admin-badge--criado'}`}>
      {LABELS[status] || status}
    </span>
  )
}