import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import { useCountUp } from '../../hooks/useCountUp'
import { IconBox, IconClipboard, IconCash, IconAlertTriangle } from '../../components/admin/AdminIcons'
import StatusBadge from '../../components/admin/StatusBadge'

function formatPrice(v) {
  return (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function StatCard({ icon: Icon, label, value, hint, alerta, delay = 0 }) {
  const numerico = typeof value === 'number'
  const animado = useCountUp(numerico ? value : 0)

  return (
    <div className={`admin-stat-card ${alerta ? 'admin-stat-card--alert' : ''}`} style={{ animationDelay: `${delay}ms` }}>
      <div className="admin-stat-card__icon">
        <Icon />
      </div>
      <p className="admin-stat-card__label">{label}</p>
      <p className="admin-stat-card__value">{numerico ? Math.round(animado) : value}</p>
      {hint && <p className="admin-stat-card__hint">{hint}</p>}
    </div>
  )
}

export default function AdminDashboard() {
  const [produtos, setProdutos] = useState([])
  const [pedidos, setPedidos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    let ativo = true
    Promise.all([api.getProdutos(), api.getPedidos()])
      .then(([listaProdutos, listaPedidos]) => {
        if (!ativo) return
        setProdutos(listaProdutos)
        setPedidos(listaPedidos)
      })
      .catch((e) => ativo && setErro(e.message))
      .finally(() => ativo && setCarregando(false))
    return () => {
      ativo = false
    }
  }, [])

  const recebido = pedidos.filter((p) => p.status === 'PAGO').reduce((soma, p) => soma + (p.total || 0), 0)
  const aReceber = pedidos
    .filter((p) => p.status === 'AGUARDANDO_PAGAMENTO' || p.status === 'CRIADO')
    .reduce((soma, p) => soma + (p.total || 0), 0)
  const aguardando = pedidos.filter((p) => p.status === 'AGUARDANDO_PAGAMENTO').length
  const estoqueBaixo = produtos.filter((p) => p.estoque <= 5)
  const recentes = [...pedidos].sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm)).slice(0, 5)

  if (erro) {
    return (
      <div className="admin-page admin-empty">
        <IconAlertTriangle />
        <p>Não foi possível carregar os dados do painel: {erro}</p>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-stats">
        <StatCard icon={IconClipboard} label="Pedidos" value={carregando ? 0 : pedidos.length} delay={0} />
        <StatCard icon={IconBox} label="Produtos" value={carregando ? 0 : produtos.length} delay={60} />
        <StatCard
          icon={IconCash}
          label="Faturamento"
          value={carregando ? 0 : recebido}
          hint={!carregando ? `Recebido ${formatPrice(recebido)} · A receber ${formatPrice(aReceber)}` : undefined}
          delay={120}
        />
        <StatCard
          icon={IconAlertTriangle}
          label="Aguardando pagamento"
          value={carregando ? 0 : aguardando}
          alerta={aguardando > 0}
          delay={180}
        />
      </div>

      <section className="admin-section">
        <div className="admin-section__header">
          <h2>Pedidos recentes</h2>
          <Link to="/admin/pedidos" className="btn btn--outline btn--sm" style={{ width: 'auto' }}>
            Ver todos
          </Link>
        </div>

        {carregando ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[0, 1, 2].map((i) => (
              <div key={i} className="admin-skeleton" style={{ height: 44 }} />
            ))}
          </div>
        ) : recentes.length === 0 ? (
          <div className="admin-empty">
            <IconClipboard />
            <p>Ainda não há pedidos.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Itens</th>
                  <th>Status</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {recentes.map((pedido, i) => (
                  <tr key={pedido.id} style={{ animationDelay: `${i * 40}ms` }}>
                    <td>
                      <Link to={`/admin/pedidos/${pedido.id}`}>{pedido.id.slice(0, 8)}...</Link>
                    </td>
                    <td>{pedido.itens?.length ?? 0}</td>
                    <td>
                      <StatusBadge status={pedido.status} />
                    </td>
                    <td>{formatPrice(pedido.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {estoqueBaixo.length > 0 && (
        <section className="admin-section">
          <div className="admin-section__header">
            <h2>Estoque baixo</h2>
            <Link to="/admin/produtos" className="btn btn--outline btn--sm" style={{ width: 'auto' }}>
              Ver produtos
            </Link>
          </div>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Estoque</th>
                </tr>
              </thead>
              <tbody>
                {estoqueBaixo.map((produto, i) => (
                  <tr key={produto.id} style={{ animationDelay: `${i * 40}ms` }}>
                    <td>{produto.nome}</td>
                    <td>
                      <span className="admin-badge admin-badge--cancelado">{produto.estoque} un.</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  )
}