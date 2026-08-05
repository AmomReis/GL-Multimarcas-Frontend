import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import StatusBadge from '../../components/admin/StatusBadge'
import { IconClipboard, IconEdit, IconSearch, IconTrash } from '../../components/admin/AdminIcons'

function formatPrice(v) {
  return (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatData(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const STATUS_FILTROS = ['TODOS', 'CRIADO', 'AGUARDANDO_PAGAMENTO', 'PAGO', 'CANCELADO']

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [busca, setBusca] = useState('')
  const [statusFiltro, setStatusFiltro] = useState('TODOS')
  const [cancelandoId, setCancelandoId] = useState(null)

  useEffect(() => {
    api
      .getPedidos()
      .then(setPedidos)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false))
  }, [])

  async function handleCancelar(pedido) {
    if (!window.confirm(`Cancelar o pedido ${pedido.id.slice(0, 8)}...? Essa ação não pode ser desfeita.`)) return
    setCancelandoId(pedido.id)
    try {
      const atualizado = await api.atualizarStatusPedido(pedido.id, 'CANCELADO')
      setPedidos((prev) => prev.map((p) => (p.id === atualizado.id ? atualizado : p)))
    } catch (e) {
      alert(`Não foi possível cancelar: ${e.message}`)
    } finally {
      setCancelandoId(null)
    }
  }

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return pedidos
      .filter((p) => statusFiltro === 'TODOS' || p.status === statusFiltro)
      .filter((p) => !termo || p.id.toLowerCase().includes(termo))
      .sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm))
  }, [pedidos, busca, statusFiltro])

  return (
    <div className="admin-page">
      <div className="admin-section">
        <div className="admin-section__header">
          <h2>Pedidos</h2>
        </div>

        <div className="admin-toolbar">
          <div className="admin-search">
            <IconSearch />
            <input type="text" placeholder="Buscar por ID do pedido..." value={busca} onChange={(e) => setBusca(e.target.value)} />
          </div>
          <select
            className="admin-select"
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
          >
            {STATUS_FILTROS.map((s) => (
              <option key={s} value={s}>
                {s === 'TODOS' ? 'Todos os status' : s.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {erro ? (
          <div className="admin-empty">
            <IconClipboard />
            <p>Não foi possível carregar os pedidos: {erro}</p>
          </div>
        ) : carregando ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="admin-skeleton" style={{ height: 52 }} />
            ))}
          </div>
        ) : filtrados.length === 0 ? (
          <div className="admin-empty">
            <IconClipboard />
            <p>Nenhum pedido encontrado.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Data</th>
                  <th>Itens</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((pedido, i) => (
                  <tr key={pedido.id} style={{ animationDelay: `${i * 35}ms` }}>
                    <td className="admin-table__cell--header">
                      <Link to={`/admin/pedidos/${pedido.id}`}>{pedido.id.slice(0, 8)}...</Link>
                    </td>
                    <td data-label="Data">{formatData(pedido.criadoEm)}</td>
                    <td data-label="Itens">{pedido.itens?.length ?? 0}</td>
                    <td data-label="Status">
                      <StatusBadge status={pedido.status} />
                    </td>
                    <td data-label="Total">{formatPrice(pedido.total)}</td>
                    <td className="admin-table__cell--actions">
                      <div className="admin-table__actions">
                        <Link to={`/admin/pedidos/${pedido.id}`} className="admin-icon-btn" aria-label="Editar status">
                          <IconEdit />
                        </Link>
                        <button
                          type="button"
                          className="admin-icon-btn admin-icon-btn--danger"
                          onClick={() => handleCancelar(pedido)}
                          disabled={pedido.status === 'CANCELADO' || cancelandoId === pedido.id}
                          aria-label="Cancelar pedido"
                          title={pedido.status === 'CANCELADO' ? 'Pedido já cancelado' : 'Cancelar pedido'}
                        >
                          <IconTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}