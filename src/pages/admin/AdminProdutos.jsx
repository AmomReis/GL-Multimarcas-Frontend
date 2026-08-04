import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, montarUrlImagem, CATEGORIA_LABEL } from '../../lib/api'
import GarmentIcon from '../../components/GarmentIcon'
import { IconPlus, IconEdit, IconTrash, IconSearch, IconBox } from '../../components/admin/AdminIcons'

function formatPrice(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function AdminProdutos() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [busca, setBusca] = useState('')
  const [excluindoId, setExcluindoId] = useState(null)

  useEffect(() => {
    api
      .getProdutos()
      .then(setProdutos)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false))
  }, [])

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    if (!termo) return produtos
    return produtos.filter((p) => p.nome.toLowerCase().includes(termo) || p.marca.toLowerCase().includes(termo))
  }, [busca, produtos])

  async function handleExcluir(produto) {
    if (!window.confirm(`Excluir "${produto.nome}"? Essa ação não pode ser desfeita.`)) return
    setExcluindoId(produto.id)
    try {
      await api.excluirProduto(produto.id)
      setProdutos((prev) => prev.filter((p) => p.id !== produto.id))
    } catch (e) {
      alert(`Não foi possível excluir: ${e.message}`)
    } finally {
      setExcluindoId(null)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-section">
        <div className="admin-section__header">
          <h2>Produtos</h2>
          <Link to="/admin/produtos/novo" className="btn btn--gold btn--sm" style={{ width: 'auto' }}>
            Novo produto
          </Link>
        </div>

        <div className="admin-toolbar">
          <div className="admin-search">
            <IconSearch />
            <input type="text" placeholder="Buscar por nome ou marca..." value={busca} onChange={(e) => setBusca(e.target.value)} />
          </div>
        </div>

        {erro ? (
          <div className="admin-empty">
            <IconBox />
            <p>Não foi possível carregar os produtos: {erro}</p>
          </div>
        ) : carregando ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="admin-skeleton" style={{ height: 52 }} />
            ))}
          </div>
        ) : filtrados.length === 0 ? (
          <div className="admin-empty">
            <IconBox />
            <p>Nenhum produto encontrado.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Categoria</th>
                  <th>Preço</th>
                  <th>Estoque</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((produto, i) => (
                  <tr key={produto.id} style={{ animationDelay: `${i * 35}ms` }}>
                    <td className="admin-table__cell--header">
                      <div className="admin-table__produto">
                        <div className="admin-table__thumb">
                          {produto.imagemUrl ? (
                            <img src={montarUrlImagem(produto.imagemUrl)} alt={produto.nome} />
                          ) : (
                            <GarmentIcon type={produto.categoria} />
                          )}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{produto.nome}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--muted)' }}>{produto.marca}</div>
                        </div>
                      </div>
                    </td>
                    <td data-label="Categoria">{CATEGORIA_LABEL[produto.categoria] || produto.categoria}</td>
                    <td data-label="Preço">{formatPrice(produto.preco)}</td>
                    <td data-label="Estoque">
                      <span className={`admin-badge ${produto.estoque <= 5 ? 'admin-badge--cancelado' : 'admin-badge--pago'}`}>
                        {produto.estoque} un.
                      </span>
                    </td>
                    <td className="admin-table__cell--actions">
                      <div className="admin-table__actions">
                        <Link to={`/admin/produtos/${produto.id}/editar`} className="admin-icon-btn" aria-label="Editar">
                          <IconEdit />
                        </Link>
                        <button
                          type="button"
                          className="admin-icon-btn admin-icon-btn--danger"
                          onClick={() => handleExcluir(produto)}
                          disabled={excluindoId === produto.id}
                          aria-label="Excluir"
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