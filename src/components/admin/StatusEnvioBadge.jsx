import { STATUS_ENVIO_LABEL } from '../../lib/api'

const CLASSES = {
  PREPARANDO: 'admin-badge--criado',
  SAIU_PARA_ENTREGA: 'admin-badge--transito',
  ENTREGUE: 'admin-badge--pago',
}

export default function StatusEnvioBadge({ status }) {
  const label = STATUS_ENVIO_LABEL[status] || 'Aguardando preparo'
  return <span className={`admin-badge ${CLASSES[status] || 'admin-badge--criado'}`}>{label}</span>
}
