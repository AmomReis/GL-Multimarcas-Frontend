import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api, montarUrlImagem, CATEGORIAS, CATEGORIA_LABEL } from '../../lib/api'
import { IconImage } from '../../components/admin/AdminIcons'

const VAZIO = {
  nome: '',
  categoria: CATEGORIAS[0],
  marca: '',
  tamanho: '',
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
          tamanho: produto.tamanho || '',
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
      tamanho: form.tamanho || null,
      preco: Number(form.preco),
      estoque: Number(form.estoque),
      peso: Number(form.peso),
      destaque: form.destaque,
      descricao: form.descricao || null,
      imagemUrl: form.imagemUrl || null,
    }

    try {
      if (editando) {
        await api.atualizarProduto(id, payload)
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

          {!editando ? (
            <label>
              Imagem do produto
              <input type="file" accept="image/*" onChange={handleImagemSelecionada} />
            </label>
          ) : (
            <label>
              URL da imagem
              <input type="text" value={form.imagemUrl} onChange={campo('imagemUrl')} placeholder="/uploads/arquivo.jpg" />
            </label>
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

          <div className="admin-form__linha">
            <label>
              Tamanho
              <input type="text" value={form.tamanho} onChange={campo('tamanho')} placeholder="Opcional" />
            </label>
            <label>
              Peso (kg)
              <input type="number" step="0.001" min="0.001" required value={form.peso} onChange={campo('peso')} />
            </label>
          </div>

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