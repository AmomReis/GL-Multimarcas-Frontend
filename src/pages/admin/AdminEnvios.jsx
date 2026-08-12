import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import { useToast } from '../../context/ToastContext'
import StatusBadge from '../../components/admin/StatusBadge'
import { IconTruck, IconMail, IconSearch, IconEye } from '../../components/admin/AdminIcons'

function formatEndereco(endereco) {
  if (!endereco) return '—'
  const complemento = endereco.complemento ? `, ${endereco.complemento}` : ''
  return `${endereco.rua}, ${endereco.numero}${complemento} - ${endereco.bairro}, ${endereco.cidade}/${endereco.estado}`
}

function formatItens(itens) {
  if (!itens || itens.length === 0) return '—'
  return itens.map((item) => `${item.quantidade}x ${item.nomeProduto}`).join(', ')
}

function formatData(iso) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}

const STATUS_ENVIO_FILTROS = ['TODOS', 'AGUARDANDO_PREPARACAO', 'PREPARANDO', 'ENVIADO', 'ENTREGUE']

export default function AdminEnvios() {
  const [pedidos, setPedidos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [busca, setBusca] = useState('')
  const [statusFiltro, setStatusFiltro] = useState('TODOS')
  const [atualizandoId, setAtualizandoId] = useState(null)
  const [notificandoId, setNotificandoId] = useState(null)
  const { showToast } = useToast()

  useEffect(() => {
    api
      .getPedidos()
      .then(setPedidos)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false))
  }, [])

  // So pedidos pagos entram na esteira de envio — os demais ainda nem
  // deveriam ser preparados/despachados.
  const envios = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return pedidos
      .filter((p) => p.status === 'PAGO' && p.envio)
      .filter((p) => statusFiltro === 'TODOS' || p.envio.status === statusFiltro)
      .filter((p) => !termo || (p.cliente?.nome || '').toLowerCase().includes(termo))
      .sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm))
  }, [pedidos, busca, statusFiltro])

  async function handleAtualizarStatus(pedido, novoStatus) {
    if (novoStatus === pedido.envio.status) return
    setAtualizandoId(pedido.id)
    try {
      const atualizado = await api.atualizarStatusEnvio(pedido.id, novoStatus)
      setPedidos((prev) => prev.map((p) => (p.id === atualizado.id ? atualizado : p)))
      showToast(`Envio marcado como ${novoStatus.replace(/_/g, ' ').toLowerCase()}`, { tipo: 'sucesso' })
    } catch (e) {
      showToast(`Não foi possível atualizar o envio: ${e.message}`, { tipo: 'erro', duracao: 5000 })
    } finally {
      setAtualizandoId(null)
    }
  }

  async function handleNotificar(pedido) {
    setNotificandoId(pedido.id)
    try {
      // Devolve o pedido com envio.notificadoEm preenchido — o back só
      // preenche isso quando o e-mail realmente sai (ver NotificacaoService).
      const atualizado = await api.notificarEnvio(pedido.id)
      setPedidos((prev) => prev.map((p) => (p.id === atualizado.id ? atualizado : p)))
      showToast(`E-mail enviado para ${pedido.cliente?.nome || 'o cliente'}`, { tipo: 'sucesso' })
    } catch (e) {
      showToast(`Não foi possível notificar o cliente: ${e.message}`, { tipo: 'erro', duracao: 5000 })
    } finally {
      setNotificandoId(null)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-section">
        <div className="admin-section__header">
          <h2>Envios</h2>
        </div>

        <div className="admin-toolbar">
          <div className="admin-search">
            <IconSearch />
            <input type="text" placeholder="Buscar por nome do cliente..." value={busca} onChange={(e) => setBusca(e.target.value)} />
          </div>
          <select
            className="admin-select"
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
          >
            {STATUS_ENVIO_FILTROS.map((s) => (
              <option key={s} value={s}>
                {s === 'TODOS' ? 'Todos os status' : s.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        {erro ? (
          <div className="admin-empty">
            <IconTruck />
            <p>Não foi possível carregar os envios: {erro}</p>
          </div>
        ) : carregando ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="admin-skeleton" style={{ height: 52 }} />
            ))}
          </div>
        ) : envios.length === 0 ? (
          <div className="admin-empty">
            <IconTruck />
            <p>Nenhum envio encontrado.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Itens</th>
                  <th>Endereço de entrega</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {envios.map((pedido, i) => {
                  const aguardandoPreparacao = pedido.envio.status === 'AGUARDANDO_PREPARACAO'
                  const notificadoEm = formatData(pedido.envio.notificadoEm)
                  return (
                    <tr key={pedido.id} style={{ animationDelay: `${i * 35}ms` }}>
                      <td className="admin-table__cell--header">{pedido.cliente?.nome}</td>
                      {/* --longo: no card do celular esses dois viram
                          rótulo em cima e texto embaixo, em vez de espremer
                          um endereço inteiro na metade direita da linha. */}
                      <td className="admin-table__cell--longo" data-label="Itens">{formatItens(pedido.itens)}</td>
                      <td className="admin-table__cell--longo" data-label="Endereço de entrega">
                        {formatEndereco(pedido.enderecoEntrega)}
                      </td>
                      <td data-label="Status">
                        <StatusBadge status={pedido.envio.status} />
                      </td>
                      <td className="admin-table__cell--actions">
                        <div className="admin-table__actions">
                          <Link to={`/admin/pedidos/${pedido.id}`} className="admin-icon-btn" aria-label="Ver detalhes do pedido">
                            <IconEye />
                          </Link>
                          <select
                            className="admin-select"
                            value={pedido.envio.status}
                            disabled={atualizandoId === pedido.id}
                            onChange={(e) => handleAtualizarStatus(pedido, e.target.value)}
                          >
                            {STATUS_ENVIO_FILTROS.filter((s) => s !== 'TODOS').map((s) => (
                              <option key={s} value={s}>
                                {s.replace(/_/g, ' ')}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            className={`admin-notify-btn ${notificadoEm ? 'admin-notify-btn--notificado' : ''}`}
                            onClick={() => handleNotificar(pedido)}
                            disabled={notificandoId === pedido.id || aguardandoPreparacao}
                            title={
                              aguardandoPreparacao
                                ? 'Mude o status antes de notificar — ainda não há nada pra avisar o cliente'
                                : notificadoEm
                                  ? `Cliente notificado em ${notificadoEm}`
                                  : 'Notificar cliente por e-mail'
                            }
                          >
                            <IconMail />
                            {notificandoId === pedido.id ? 'Enviando...' : notificadoEm ? 'Notificado' : 'Notificar'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
