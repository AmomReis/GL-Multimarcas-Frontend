import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api, montarUrlImagem, CATEGORIAS, CATEGORIA_LABEL } from '../../lib/api'
import { IconImage } from '../../components/admin/AdminIcons'

const VAZIO = {
  nome: '',
  categoria: CATEGORIAS[0],
  marca: '',
  tamanhos: [],
  preco: '',
  estoque: '',
  peso: '0.300',
  destaque: false,
  descricao: '',
  imagemUrl: '',
}

export default function AdminProdutoForm() {
  const { id } = useParams()
  const editando = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(VAZIO)
  const [novoTamanho, setNovoTamanho] = useState('')
  const [arquivoImagem, setArquivoImagem] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [carregando, setCarregando] = useState(editando)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState(null)

  useEffect(() => {
    if (!editando) return
    api
      .getProduto(id)
      .then((produto) =>
        setForm({
          nome: produto.nome || '',
          categoria: produto.categoria,
          marca: produto.marca || '',
          tamanhos: produto.tamanhos || [],
          preco: String(produto.preco ?? ''),
          estoque: String(produto.estoque ?? ''),
          peso: String(produto.peso ?? '0.300'),
          destaque: Boolean(produto.destaque),
          descricao: produto.descricao || '',
          imagemUrl: produto.imagemUrl || '',
        }),
      )
      .catch((e) => setErro(e.message))
      .finally(() => setCarregando(false))
  }, [id, editando])

  function campo(chave) {
    return (e) => {
      const valor = e.target.type === 'checkbox' ? e.target.checked : e.target.value
      setForm((prev) => ({ ...prev, [chave]: valor }))
    }
  }

  function handleAdicionarTamanho() {
    const valor = novoTamanho.trim()
    if (!valor) return
    const jaExiste = form.tamanhos.some((t) => t.toLowerCase() === valor.toLowerCase())
    setNovoTamanho('')
    if (jaExiste) return
    setForm((prev) => ({ ...prev, tamanhos: [...prev.tamanhos, valor] }))
  }

  function handleTamanhoKeyDown(e) {
    if (e.key !== 'Enter') return
    e.preventDefault()
    handleAdicionarTamanho()
  }

  function handleRemoverTamanho(valor) {
    setForm((prev) => ({ ...prev, tamanhos: prev.tamanhos.filter((t) => t !== valor) }))
  }

  function handleImagemSelecionada(e) {
    const arquivo = e.target.files?.[0]
    if (!arquivo) return
    setArquivoImagem(arquivo)
    setPreviewUrl(URL.createObjectURL(arquivo))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro(null)
    setSalvando(true)

    const payload = {
      nome: form.nome,
      categoria: form.categoria,
      marca: form.marca,
      tamanhos: form.tamanhos,
      preco: Number(form.preco),
      estoque: Number(form.estoque),
      peso: Number(form.peso),
      destaque: form.destaque,
      descricao: form.descricao || null,
      imagemUrl: form.imagemUrl || null,
    }

    try {
      if (editando) {
        await api.atualizarProduto(id, payload, arquivoImagem)
      } else {
        await api.criarProduto(payload, arquivoImagem)
      }
      navigate('/admin/produtos')
    } catch (e2) {
      setErro(e2.message)
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) {
    return (
      <div className="admin-page">
        <div className="admin-skeleton" style={{ height: 300, maxWidth: 640 }} />
      </div>
    )
  }

  const imagemAtual = previewUrl || (form.imagemUrl ? montarUrlImagem(form.imagemUrl) : '')

  return (
    <div className="admin-page">
      <div className="admin-section">
        <div className="admin-section__header">
          <h2>{editando ? 'Editar produto' : 'Novo produto'}</h2>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form__imagem-preview">
            {imagemAtual ? <img src={imagemAtual} alt="Pré-visualização" /> : <IconImage />}
          </div>

          <label>
            {editando ? 'Trocar imagem do produto' : 'Imagem do produto'}
            <input type="file" accept="image/*" onChange={handleImagemSelecionada} />
          </label>
          {editando && !arquivoImagem && (
            <p className="admin-form__hint">Deixe em branco para manter a imagem atual.</p>
          )}

          <label>
            Nome
            <input type="text" required value={form.nome} onChange={campo('nome')} />
          </label>

          <div className="admin-form__linha">
            <label>
              Categoria
              <select value={form.categoria} onChange={campo('categoria')}>
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>
                    {CATEGORIA_LABEL[c] || c}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Marca
              <input type="text" required value={form.marca} onChange={campo('marca')} />
            </label>
          </div>

          <div className="admin-form__linha">
            <label>
              Preço (R$)
              <input type="number" step="0.01" min="0.01" required value={form.preco} onChange={campo('preco')} />
            </label>
            <label>
              Estoque
              <input type="number" min="0" required value={form.estoque} onChange={campo('estoque')} />
            </label>
          </div>

          <label>
            Peso (kg)
            <input type="number" step="0.001" min="0.001" required value={form.peso} onChange={campo('peso')} />
          </label>

          <label>
            Tamanhos (deixe vazio se o produto não precisar de tamanho)
            <div className="admin-tamanho-input">
              <input
                type="text"
                value={novoTamanho}
                onChange={(e) => setNovoTamanho(e.target.value)}
                onKeyDown={handleTamanhoKeyDown}
                placeholder="Ex: P, M, G, 40..."
              />
              <button type="button" className="btn btn--gold btn--sm-inline" onClick={handleAdicionarTamanho}>
                Adicionar
              </button>
            </div>
          </label>

          {form.tamanhos.length > 0 && (
            <div className="admin-tamanho-tags">
              {form.tamanhos.map((tamanho) => (
                <span className="admin-tamanho-tag" key={tamanho}>
                  {tamanho}
                  <button
                    type="button"
                    className="admin-tamanho-tag__remover"
                    onClick={() => handleRemoverTamanho(tamanho)}
                    aria-label={`Remover tamanho ${tamanho}`}
                    title={`Remover tamanho ${tamanho}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <label>
            Descrição
            <textarea value={form.descricao} onChange={campo('descricao')} />
          </label>

          <label className="admin-form__checkbox">
            <input type="checkbox" checked={form.destaque} onChange={campo('destaque')} />
            Exibir como destaque na vitrine
          </label>

          {erro && <p className="auth-form__erro">{erro}</p>}

          <div className="admin-form__actions">
            <button type="submit" className="btn btn--gold" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar produto'}
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => navigate('/admin/produtos')}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}