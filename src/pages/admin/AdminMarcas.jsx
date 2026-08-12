import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { useToast } from '../../context/ToastContext'
import { IconTag } from '../../components/admin/AdminIcons'
import ConfirmDialog from '../../components/admin/ConfirmDialog'

export default function AdminMarcas() {
  const [marcas, setMarcas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [novaMarca, setNovaMarca] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erroForm, setErroForm] = useState(null)
  const [excluindoId, setExcluindoId] = useState(null)
  const [marcaParaExcluir, setMarcaParaExcluir] = useState(null)
  const { showToast } = useToast()

  useEffect(() => {
    api
      .getMarcas()
      .then(setMarcas)
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false))
  }, [])

  async function handleAdicionar(e) {
    e.preventDefault()
    const nome = novaMarca.trim()
    if (!nome) return
    setErroForm(null)
    setSalvando(true)
    try {
      const marca = await api.criarMarca(nome)
      setMarcas((prev) => [...prev, marca].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR')))
      setNovaMarca('')
    } catch (e2) {
      setErroForm(e2.message)
    } finally {
      setSalvando(false)
    }
  }

  async function confirmarExclusao() {
    const marca = marcaParaExcluir
    if (!marca) return
    setExcluindoId(marca.id)
    try {
      await api.excluirMarca(marca.id)
      setMarcas((prev) => prev.filter((m) => m.id !== marca.id))
      setMarcaParaExcluir(null)
      showToast(`Marca "${marca.nome}" excluída`, { tipo: 'sucesso' })
    } catch (e) {
      showToast(`Não foi possível excluir: ${e.message}`, { tipo: 'erro', duracao: 5000 })
    } finally {
      setExcluindoId(null)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-section">
        <div className="admin-section__header">
          <h2>Marcas</h2>
        </div>

        <form className="admin-form" style={{ maxWidth: 420 }} onSubmit={handleAdicionar}>
          <input
            type="text"
            value={novaMarca}
            onChange={(e) => setNovaMarca(e.target.value)}
            placeholder="Ex: Nike, Adidas, Lacoste..."
            aria-label="Nome da nova marca"
          />
          <button type="submit" className="btn btn--gold btn--sm-inline" disabled={salvando}>
            {salvando ? 'Adicionando...' : 'Adicionar'}
          </button>
        </form>
        {erroForm && <p className="auth-form__erro">{erroForm}</p>}

        <p className="admin-form__hint" style={{ marginTop: '0.6rem' }}>
          Marcas cadastradas aqui aparecem na home, em "Todos os Produtos" e no formulário de produto.
        </p>

        {erro ? (
          <div className="admin-empty">
            <IconTag />
            <p>Não foi possível carregar as marcas: {erro}</p>
          </div>
        ) : carregando ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1.2rem' }}>
            {[0, 1, 2].map((i) => (
              <div key={i} className="admin-skeleton" style={{ height: 44 }} />
            ))}
          </div>
        ) : marcas.length === 0 ? (
          <div className="admin-empty">
            <IconTag />
            <p>Nenhuma marca cadastrada ainda.</p>
          </div>
        ) : (
          <div className="admin-tamanho-tags" style={{ marginTop: '1.2rem' }}>
            {marcas.map((marca) => (
              <span className="admin-tamanho-tag" key={marca.id}>
                {marca.nome}
                <button
                  type="button"
                  className="admin-tamanho-tag__remover"
                  onClick={() => setMarcaParaExcluir(marca)}
                  disabled={excluindoId === marca.id}
                  aria-label={`Excluir marca ${marca.nome}`}
                  title={`Excluir marca ${marca.nome}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        aberto={Boolean(marcaParaExcluir)}
        titulo="Tem certeza de excluir essa marca?"
        mensagem={marcaParaExcluir ? `"${marcaParaExcluir.nome}" será removida permanentemente. Essa ação não pode ser desfeita.` : ''}
        confirmando={excluindoId === marcaParaExcluir?.id}
        onConfirmar={confirmarExclusao}
        onCancelar={() => setMarcaParaExcluir(null)}
      />
    </div>
  )
}
