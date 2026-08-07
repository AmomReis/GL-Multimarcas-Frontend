import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, montarUrlImagem } from '../../lib/api'
import { IconPlus, IconEdit, IconTrash, IconImage } from '../../components/admin/AdminIcons'
import ConfirmDialog from '../../components/admin/ConfirmDialog'

export default function AdminPromocoes() {
  const [promocoes, setPromocoes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [alternandoId, setAlternandoId] = useState(null)
  const [excluindoId, setExcluindoId] = useState(null)
  const [promocaoParaExcluir, setPromocaoParaExcluir] = useState(null)

  useEffect(() => {
    api
      .getPromocoesAdmin()
      .then(setPromocoes)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false))
  }, [])

  async function handleAlternarAtivo(promocao) {
    setAlternandoId(promocao.id)
    try {
      const atualizada = await api.alternarAtivoPromocao(promocao.id, !promocao.ativo)
      setPromocoes((prev) => prev.map((p) => (p.id === atualizada.id ? atualizada : p)))
    } catch (e) {
      alert(`Não foi possível atualizar: ${e.message}`)
    } finally {
      setAlternandoId(null)
    }
  }

  async function confirmarExclusao() {
    const promocao = promocaoParaExcluir
    if (!promocao) return
    setExcluindoId(promocao.id)
    try {
      await api.excluirPromocao(promocao.id)
      setPromocoes((prev) => prev.filter((p) => p.id !== promocao.id))
      setPromocaoParaExcluir(null)
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
          <h2>Promoções</h2>
          <Link to="/admin/promocoes/nova" className="btn btn--gold btn--sm" style={{ width: 'auto' }}>
            Nova promoção
          </Link>
        </div>

        <p className="admin-form__hint" style={{ marginBottom: '1rem' }}>
          A imagem já vem pronta com título, condição e período — só selecione a imagem, pra onde o clique leva, e
          se ela deve aparecer no carrossel da home agora.
        </p>

        {erro ? (
          <div className="admin-empty">
            <IconImage />
            <p>Não foi possível carregar as promoções: {erro}</p>
          </div>
        ) : carregando ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[0, 1].map((i) => (
              <div key={i} className="admin-skeleton" style={{ height: 52 }} />
            ))}
          </div>
        ) : promocoes.length === 0 ? (
          <div className="admin-empty">
            <IconImage />
            <p>Nenhuma promoção cadastrada ainda.</p>
          </div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Promoção</th>
                  <th>Link</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {promocoes.map((promocao, i) => (
                  <tr key={promocao.id} style={{ animationDelay: `${i * 35}ms` }}>
                    <td className="admin-table__cell--header">
                      <div className="admin-table__produto">
                        <div className="admin-table__thumb">
                          {promocao.imagemUrl ? (
                            <img src={montarUrlImagem(promocao.imagemUrl)} alt="" />
                          ) : (
                            <IconImage />
                          )}
                        </div>
                      </div>
                    </td>
                    <td data-label="Link">
                      {promocao.link || <span style={{ color: 'var(--muted)' }}>—</span>}
                    </td>
                    <td data-label="Status">
                      <button
                        type="button"
                        className={`admin-badge ${promocao.ativo ? 'admin-badge--pago' : 'admin-badge--cancelado'}`}
                        style={{ border: 'none', cursor: 'pointer' }}
                        onClick={() => handleAlternarAtivo(promocao)}
                        disabled={alternandoId === promocao.id}
                      >
                        {promocao.ativo ? 'Ativa' : 'Inativa'}
                      </button>
                    </td>
                    <td className="admin-table__cell--actions">
                      <div className="admin-table__actions">
                        <Link to={`/admin/promocoes/${promocao.id}/editar`} className="admin-icon-btn" aria-label="Editar">
                          <IconEdit />
                        </Link>
                        <button
                          type="button"
                          className="admin-icon-btn admin-icon-btn--danger"
                          onClick={() => setPromocaoParaExcluir(promocao)}
                          disabled={excluindoId === promocao.id}
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

      <ConfirmDialog
        aberto={Boolean(promocaoParaExcluir)}
        titulo="Tem certeza de excluir essa promoção?"
        mensagem="Ela será removida permanentemente do carrossel da home. Essa ação não pode ser desfeita."
        confirmando={excluindoId === promocaoParaExcluir?.id}
        onConfirmar={confirmarExclusao}
        onCancelar={() => setPromocaoParaExcluir(null)}
      />
    </div>
  )
}
