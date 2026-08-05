import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api, montarUrlImagem, STATUS_ENVIO, STATUS_ENVIO_LABEL } from '../../lib/api'
import StatusBadge from '../../components/admin/StatusBadge'
import StatusEnvioBadge from '../../components/admin/StatusEnvioBadge'
import { IconClipboard, IconImage } from '../../components/admin/AdminIcons'

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
  const [novoStatusEnvio, setNovoStatusEnvio] = useState('')
  const [salvandoEnvio, setSalvandoEnvio] = useState(false)
  const [erroEnvio, setErroEnvio] = useState(null)

  useEffect(() => {
    api
      .getPedido(id)
      .then((dados) => {
        setPedido(dados)
        setNovoStatus(dados.status)
        setNovoStatusEnvio(dados.statusEnvio || STATUS_ENVIO[0])
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

  async function handleSalvarStatusEnvio() {
    if (novoStatusEnvio === pedido.statusEnvio) return
    setErroEnvio(null)
    setSalvandoEnvio(true)
    try {
      const atualizado = await api.atualizarStatusEnvio(id, novoStatusEnvio)
      setPedido(atualizado)
    } catch (e) {
      setErroEnvio(e.message)
    } finally {
      setSalvandoEnvio(false)
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
                <th>Tamanho</th>
                <th>Qtd.</th>
                <th>Preço unit.</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {pedido.itens.map((item) => (
                <tr key={`${item.produtoId}-${item.tamanho || ''}`}>
                  <td className="admin-table__cell--header">
                    <div className="admin-table__produto">
                      <div className="admin-table__thumb">
                        {item.imagemUrl ? (
                          <img src={montarUrlImagem(item.imagemUrl)} alt={item.nomeProduto} />
                        ) : (
                          <IconImage />
                        )}
                      </div>
                      <span>{item.nomeProduto}</span>
                    </div>
                  </td>
                  <td data-label="Tamanho">{item.tamanho || '—'}</td>
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

      <div className="admin-section">
        <div className="admin-section__header">
          <h2>Endereço de entrega</h2>
        </div>
        {pedido.enderecoEntrega ? (
          <div className="conta-info">
            <p>
              <span>Endereço</span>
              {pedido.enderecoEntrega.rua}, {pedido.enderecoEntrega.numero}
              {pedido.enderecoEntrega.complemento ? ` — ${pedido.enderecoEntrega.complemento}` : ''}
            </p>
            <p>
              <span>Bairro</span>
              {pedido.enderecoEntrega.bairro}
            </p>
            <p>
              <span>Cidade</span>
              {pedido.enderecoEntrega.cidade} — {pedido.enderecoEntrega.estado}
            </p>
            <p>
              <span>CEP</span>
              {pedido.enderecoEntrega.cep}
            </p>
          </div>
        ) : (
          <p style={{ color: 'var(--muted)' }}>Endereço de entrega não informado para este pedido.</p>
        )}
      </div>

      <div className="admin-section">
        <div className="admin-section__header">
          <h2>Envio</h2>
          <StatusEnvioBadge status={pedido.statusEnvio} />
        </div>

        <div className="admin-toolbar" style={{ marginBottom: 0 }}>
          <select
            className="admin-select"
            value={novoStatusEnvio}
            onChange={(e) => setNovoStatusEnvio(e.target.value)}
            aria-label="Alterar status da entrega"
          >
            {STATUS_ENVIO.map((s) => (
              <option key={s} value={s}>
                {STATUS_ENVIO_LABEL[s]}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn btn--gold btn--sm-inline"
            disabled={salvandoEnvio || novoStatusEnvio === pedido.statusEnvio}
            onClick={handleSalvarStatusEnvio}
          >
            {salvandoEnvio ? 'Salvando...' : 'Salvar status da entrega'}
          </button>
          {erroEnvio && <p className="auth-form__erro" style={{ width: '100%', margin: 0 }}>{erroEnvio}</p>}
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