import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, montarUrlImagem, STATUS_ENVIO, STATUS_ENVIO_LABEL } from '../../lib/api'
import StatusEnvioBadge from '../../components/admin/StatusEnvioBadge'
import { IconImage, IconTruck } from '../../components/admin/AdminIcons'

function formatData(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const STATUS_ENVIO_FILTROS = ['TODOS', ...STATUS_ENVIO]

export default function AdminEnvios() {
  const [pedidos, setPedidos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [statusFiltro, setStatusFiltro] = useState('TODOS')
  const [pedidoSelecionado, setPedidoSelecionado] = useState(null)

  useEffect(() => {
    api
      .getPedidos()
      .then(setPedidos)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false))
  }, [])

  // Fila: pedidos mais recentes primeiro.
  const fila = useMemo(() => {
    return pedidos
      .filter((p) => statusFiltro === 'TODOS' || (p.statusEnvio || STATUS_ENVIO[0]) === statusFiltro)
      .sort((a, b) => new Date(b.criadoEm) - new Date(a.criadoEm))
  }, [pedidos, statusFiltro])

  function handleAtualizarPedido(atualizado) {
    setPedidos((prev) => prev.map((p) => (p.id === atualizado.id ? atualizado : p)))
  }

  return (
    <div className="admin-page">
      <div className="admin-section">
        <div className="admin-section__header">
          <h2>Fila de envios</h2>
        </div>

        <div className="admin-toolbar">
          <select
            className="admin-select"
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
            aria-label="Filtrar por status da entrega"
          >
            {STATUS_ENVIO_FILTROS.map((s) => (
              <option key={s} value={s}>
                {s === 'TODOS' ? 'Todos os status' : STATUS_ENVIO_LABEL[s]}
              </option>
            ))}
          </select>
        </div>

        {erro ? (
          <div className="admin-empty">
            <IconTruck />
            <p>Não foi possível carregar a fila de envios: {erro}</p>
          </div>
        ) : carregando ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="admin-skeleton" style={{ height: 96 }} />
            ))}
          </div>
        ) : fila.length === 0 ? (
          <div className="admin-empty">
            <IconTruck />
            <p>Nenhum pedido na fila de envios.</p>
          </div>
        ) : (
          <div className="envios-fila">
            {fila.map((pedido, i) => (
              <div key={pedido.id} className="envios-card" style={{ animationDelay: `${i * 35}ms` }}>
                <div className="envios-card__thumbs">
                  {(pedido.itens || []).slice(0, 4).map((item, idx) => (
                    <div key={`${item.produtoId}-${idx}`} className="envios-card__thumb" title={item.nomeProduto}>
                      {item.imagemUrl ? (
                        <img src={montarUrlImagem(item.imagemUrl)} alt={item.nomeProduto} />
                      ) : (
                        <IconImage />
                      )}
                    </div>
                  ))}
                  {(pedido.itens?.length || 0) > 4 && (
                    <div className="envios-card__thumb envios-card__thumb--extra">+{pedido.itens.length - 4}</div>
                  )}
                </div>

                <div className="envios-card__info">
                  <strong>
                    {pedido.cliente?.nome ? `Pedido de ${pedido.cliente.nome}` : 'Pedido sem cliente identificado'}
                  </strong>
                  <span className="envios-card__data">{formatData(pedido.criadoEm)}</span>
                  <StatusEnvioBadge status={pedido.statusEnvio} />
                </div>

                <div className="envios-card__actions">
                  <Link to={`/admin/pedidos/${pedido.id}`} className="btn btn--outline btn--sm-inline">
                    Detalhes do pedido
                  </Link>
                  <button
                    type="button"
                    className="btn btn--gold btn--sm-inline"
                    onClick={() => setPedidoSelecionado(pedido)}
                  >
                    Alterar status da entrega
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {pedidoSelecionado && (
        <AlterarStatusEnvioModal
          pedido={pedidoSelecionado}
          onClose={() => setPedidoSelecionado(null)}
          onSalvo={(atualizado) => {
            handleAtualizarPedido(atualizado)
            setPedidoSelecionado(null)
          }}
        />
      )}
    </div>
  )
}

function AlterarStatusEnvioModal({ pedido, onClose, onSalvo }) {
  const [status, setStatus] = useState(pedido.statusEnvio || STATUS_ENVIO[0])
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState(null)

  async function handleSalvar() {
    setErro(null)
    setSalvando(true)
    try {
      const atualizado = await api.atualizarStatusEnvio(pedido.id, status)
      onSalvo(atualizado)
    } catch (e) {
      setErro(e.message)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal__header">
          <h3>Alterar status da entrega</h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '0.3rem 0 0' }}>
            {pedido.cliente?.nome ? `Pedido de ${pedido.cliente.nome}` : 'Pedido sem cliente identificado'}
          </p>
        </div>

        <div className="admin-modal__body">
          {STATUS_ENVIO.map((s) => (
            <label key={s} className="admin-modal__opcao">
              <input type="radio" name="statusEnvio" value={s} checked={status === s} onChange={() => setStatus(s)} />
              {STATUS_ENVIO_LABEL[s]}
            </label>
          ))}
          {erro && <p className="auth-form__erro" style={{ margin: '0.8rem 0 0' }}>{erro}</p>}
        </div>

        <div className="admin-modal__footer">
          <button type="button" className="btn btn--outline btn--sm-inline" onClick={onClose} disabled={salvando}>
            Cancelar
          </button>
          <button type="button" className="btn btn--gold btn--sm-inline" onClick={handleSalvar} disabled={salvando}>
            {salvando ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  )
}
