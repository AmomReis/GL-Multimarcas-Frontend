import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api'

const CONFIG = {
  sucesso: {
    titulo: 'Pagamento aprovado',
    descricao: 'Recebemos o retorno de pagamento aprovado do Mercado Pago.',
  },
  pendente: {
    titulo: 'Pagamento pendente',
    descricao: 'O Mercado Pago informou que o pagamento ainda está em processamento.',
  },
  falha: {
    titulo: 'Pagamento não aprovado',
    descricao: 'O pagamento não foi aprovado. Você pode tentar novamente pelo carrinho.',
  },
}

const STATUS_LABEL = {
  approved: 'Aprovado',
  pending: 'Pendente',
  in_process: 'Em processamento',
  rejected: 'Recusado',
  cancelled: 'Cancelado',
  failure: 'Falha',
  null: 'Não informado',
}

function valorParam(searchParams, nomes) {
  for (const nome of nomes) {
    const valor = searchParams.get(nome)
    if (valor) return valor
  }
  return null
}

function labelStatus(status) {
  if (!status) return STATUS_LABEL.null
  return STATUS_LABEL[status] || status
}

function formatPrice(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function PagamentoRetorno() {
  const { resultado } = useParams()
  const [searchParams] = useSearchParams()
  const config = CONFIG[resultado] || CONFIG.pendente

  const status = valorParam(searchParams, ['status', 'collection_status'])
  const paymentId = valorParam(searchParams, ['payment_id', 'collection_id'])
  const externalReference = valorParam(searchParams, ['external_reference'])
  const merchantOrderId = valorParam(searchParams, ['merchant_order_id'])

  const [pedido, setPedido] = useState(null)
  const [carregando, setCarregando] = useState(Boolean(externalReference))

  // Os parâmetros da URL vêm do navegador do cliente e servem só pra UX
  // imediata — quem manda de verdade é o status guardado no seu backend
  // (atualizado pelo webhook do Mercado Pago). Por isso reconsultamos o
  // pedido aqui em vez de confiar só na query string.
  useEffect(() => {
    if (!externalReference) return
    let ativo = true

    api
      .getPedidoStatusPublico(externalReference)
      .then((dados) => ativo && setPedido(dados))
      .catch(() => {})
      .finally(() => ativo && setCarregando(false))

    return () => {
      ativo = false
    }
  }, [externalReference])

  const statusReal = pedido?.status
  const totalReal = pedido?.total

  return (
    <div className="pagina-status">
      <h1 className="section-title">{config.titulo}</h1>
      <p>{config.descricao}</p>

      {carregando ? (
        <p className="pagina-status__aviso">Confirmando status do pedido...</p>
      ) : (
        <div className="pagamento-retorno__dados">
          <p>Status: <strong>{pedido ? statusReal : labelStatus(status)}</strong></p>
          {externalReference && <p>Pedido: <strong>{externalReference}</strong></p>}
          {typeof totalReal === 'number' && <p>Total: <strong>{formatPrice(totalReal)}</strong></p>}
          {!pedido && paymentId && <p>Pagamento: <strong>{paymentId}</strong></p>}
          {!pedido && merchantOrderId && <p>Ordem Mercado Pago: <strong>{merchantOrderId}</strong></p>}
        </div>
      )}

      <div className="pagamento-retorno__acoes">
        <Link to="/loja" className="btn btn--gold">Continuar comprando</Link>
        <Link to="/carrinho" className="btn btn--outline">Ver carrinho</Link>
      </div>
    </div>
  )
}
