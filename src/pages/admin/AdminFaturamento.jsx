import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { IconCash, IconAlertTriangle } from '../../components/admin/AdminIcons'

function formatPrice(v) {
  return (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function chaveMes(iso) {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

function rotuloMes(chave) {
  const [ano, mes] = chave.split('-').map(Number)
  return `${MESES[mes - 1]} de ${ano}`
}

export default function AdminFaturamento() {
  const [pedidos, setPedidos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    let ativo = true
    api
      .getPedidos()
      .then((dados) => ativo && setPedidos(dados))
      .catch((e) => ativo && setErro(e.message))
      .finally(() => ativo && setCarregando(false))
    return () => {
      ativo = false
    }
  }, [])

  // Agrupa os pedidos por mês de criação, separando o que já foi
  // recebido (PAGO) do que ainda está pendente (CRIADO/AGUARDANDO_PAGAMENTO).
  const meses = {}
  for (const pedido of pedidos) {
    if (!pedido.criadoEm) continue
    const chave = chaveMes(pedido.criadoEm)
    if (!meses[chave]) {
      meses[chave] = { chave, pedidos: 0, recebido: 0, pendente: 0, cancelado: 0 }
    }
    meses[chave].pedidos += 1
    if (pedido.status === 'PAGO') meses[chave].recebido += pedido.total || 0
    else if (pedido.status === 'AGUARDANDO_PAGAMENTO' || pedido.status === 'CRIADO') meses[chave].pendente += pedido.total || 0
    else if (pedido.status === 'CANCELADO') meses[chave].cancelado += pedido.total || 0
  }

  const listaMeses = Object.values(meses).sort((a, b) => (a.chave < b.chave ? 1 : -1))
  const totalRecebido = listaMeses.reduce((soma, m) => soma + m.recebido, 0)
  const totalPendente = listaMeses.reduce((soma, m) => soma + m.pendente, 0)

  if (erro) {
    return (
      <div className="admin-page admin-empty">
        <IconAlertTriangle />
        <p>Não foi possível carregar o faturamento: {erro}</p>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-card__icon">
            <IconCash />
          </div>
          <p className="admin-stat-card__label">Total recebido</p>
          <p className="admin-stat-card__value">{carregando ? '—' : formatPrice(totalRecebido)}</p>
        </div>
        <div className="admin-stat-card admin-stat-card--alert">
          <div className="admin-stat-card__icon">
            <IconCash />
          </div>
          <p className="admin-stat-card__label">Total a receber</p>
          <p className="admin-stat-card__value">{carregando ? '—' : formatPrice(totalPendente)}</p>
        </div>
      </div>

      <section className="admin-section">
        <div className="admin-section__header">
          <h2>Faturamento por mês</h2>
        </div>

        {carregando ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[0, 1, 2].map((i) => (
              <div key={i} className="admin-skeleton" style={{ height: 44 }} />
            ))}
          </div>
        ) : listaMeses.length === 0 ? (
          <div className="admin-empty">
            <IconCash />
            <p>Ainda não há pedidos pra calcular o faturamento.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Mês</th>
                  <th>Pedidos</th>
                  <th>Recebido</th>
                  <th>A receber</th>
                  <th>Cancelado</th>
                </tr>
              </thead>
              <tbody>
                {listaMeses.map((m, i) => (
                  <tr key={m.chave} style={{ animationDelay: `${i * 35}ms` }}>
                    <td className="admin-table__cell--header">{rotuloMes(m.chave)}</td>
                    <td data-label="Pedidos">{m.pedidos}</td>
                    <td data-label="Recebido">{formatPrice(m.recebido)}</td>
                    <td data-label="A receber">{formatPrice(m.pendente)}</td>
                    <td data-label="Cancelado">{formatPrice(m.cancelado)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
