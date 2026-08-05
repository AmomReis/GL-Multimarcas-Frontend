import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../../lib/api'
import StatusBadge from '../../components/admin/StatusBadge'
import { IconClipboard } from '../../components/admin/AdminIcons'

const STATUS_OPCOES = ['CRIADO', 'AGUARDANDO_PAGAMENTO', 'PAGO', 'CANCELADO']

function formatPrice(v) {
  return (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatData(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function AdminPedidoDetail() {
  const { id } = useParams()
  const [pedido, setPedido] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [novoStatus, setNovoStatus] = useState('')
  const [salvandoStatus, setSalvandoStatus] = useState(false)
  const [erroStatus, setErroStatus] = useState(null)

  useEffect(() => {
    api
      .getPedido(id)
      .then((dados) => {
        setPedido(dados)
        setNovoStatus(dados.status)
      })
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false))
  }, [id])

  async function handleSalvarStatus() {
    if (novoStatus === pedido.status) return
    setErroStatus(null)
    setSalvandoStatus(true)
    try {
      const atualizado = await api.atualizarStatusPedido(id, novoStatus)
      setPedido(atualizado)
    } catch (e) {
      setErroStatus(e.message)
    } finally {
      setSalvandoStatus(false)
    }
  }

  if (carregando) {
    return (
      <div className="admin-page">
        <div className="admin-skeleton" style={{ height: 320 }} />
      </div>
    )
  }

  if (erro || !pedido) {
    return (
      <div className="admin-page admin-empty">
        <IconClipboard />
        <p>Não foi possível carregar esse pedido{erro ? `: ${erro}` : '.'}</p>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <Link to="/admin/pedidos" className="btn-voltar" style={{ display: 'inline-block', marginBottom: '1rem' }}>
        ← Voltar para pedidos
      </Link>

      <div className="admin-section">
        <div className="admin-section__header">
          <div>
            <h2>Pedido {pedido.id}</h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '0.3rem 0 0' }}>Criado em {formatData(pedido.criadoEm)}</p>
          </div>
          <StatusBadge status={pedido.status} />
        </div>

        <div className="admin-toolbar" style={{ marginBottom: '1.4rem' }}>
          <select
            className="admin-select"
            value={novoStatus}
            onChange={(e) => setNovoStatus(e.target.value)}
            aria-label="Alterar status do pedido"
          >
            {STATUS_OPCOES.map((s) => (
              <option key={s} value={s}>
                {s.replace('_', ' ')}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn btn--gold btn--sm-inline"
            disabled={salvandoStatus || novoStatus === pedido.status}
            onClick={handleSalvarStatus}
          >
            {salvandoStatus ? 'Salvando...' : 'Salvar status'}
          </button>
          {erroStatus && <p className="auth-form__erro" style={{ width: '100%', margin: 0 }}>{erroStatus}</p>}
        </div>

        <div className="conta-info" style={{ marginBottom: '1.4rem' }}>
            <p>
                <span>Cliente</span>
                {pedido.cliente?.nome}
            </p>
            <p>
                <span>E-mail</span>
                {pedido.cliente?.email}
            </p>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qtd.</th>
                <th>Preço unit.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {pedido.itens.map((item) => (
                <tr key={item.produtoId}>
                  <td className="admin-table__cell--header">{item.nomeProduto}</td>
                  <td data-label="Qtd.">{item.quantidade}</td>
                  <td data-label="Preço unit.">{formatPrice(item.precoUnitario)}</td>
                  <td data-label="Subtotal">{formatPrice(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="carrinho__resumo" style={{ marginTop: '1.2rem' }}>
          <span>Produtos</span>
          <strong>{formatPrice(pedido.totalProdutos)}</strong>
        </div>
        <div className="carrinho__resumo" style={{ borderTop: 'none', paddingTop: '0.4rem' }}>
          <span>Frete</span>
          <strong>{formatPrice(pedido.frete)}</strong>
        </div>
        <div className="carrinho__resumo" style={{ borderTop: '1px solid var(--card-border)', marginTop: '0.4rem' }}>
          <span>Total</span>
          <strong style={{ color: 'var(--gold)' }}>{formatPrice(pedido.total)}</strong>
        </div>
      </div>

      {pedido.pagamento && (
        <div className="admin-section">
          <div className="admin-section__header">
            <h2>Pagamento</h2>
          </div>
          <div className="conta-info">
            <p>
              <span>Status</span>
              {pedido.pagamento.status}
            </p>
            <p>
              <span>Forma</span>
              {pedido.pagamento.formaPagamento || 'Não confirmada ainda'}
            </p>
            <p>
              <span>Transação</span>
              {pedido.pagamento.transacaoId || '—'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}