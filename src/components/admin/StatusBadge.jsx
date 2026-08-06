const LABELS = {
  CRIADO: 'Criado',
  AGUARDANDO_PAGAMENTO: 'Aguardando',
  PAGO: 'Pago',
  CANCELADO: 'Cancelado',
  // StatusEnvio — chaves não colidem com StatusPedido acima.
  AGUARDANDO_PREPARACAO: 'Aguardando preparação',
  PREPARANDO: 'Preparando',
  ENVIADO: 'Saiu para entrega',
  ENTREGUE: 'Entregue',
}

const CLASSES = {
  CRIADO: 'admin-badge--criado',
  AGUARDANDO_PAGAMENTO: 'admin-badge--aguardando',
  PAGO: 'admin-badge--pago',
  CANCELADO: 'admin-badge--cancelado',
  AGUARDANDO_PREPARACAO: 'admin-badge--criado',
  PREPARANDO: 'admin-badge--aguardando',
  ENVIADO: 'admin-badge--enviado',
  ENTREGUE: 'admin-badge--pago',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`admin-badge ${CLASSES[status] || 'admin-badge--criado'}`}>
      {LABELS[status] || status}
    </span>
  )
}