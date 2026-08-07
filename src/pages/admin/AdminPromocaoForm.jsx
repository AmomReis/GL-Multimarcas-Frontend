import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api, montarUrlImagem } from '../../lib/api'
import { IconImage } from '../../components/admin/AdminIcons'

const VAZIO = {
  link: '',
  ativo: true,
  imagemUrl: '',
}

export default function AdminPromocaoForm() {
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
      .getPromocao(id)
      .then((promocao) =>
        setForm({
          link: promocao.link || '',
          ativo: Boolean(promocao.ativo),
          imagemUrl: promocao.imagemUrl || '',
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

    if (!editando && !arquivoImagem) {
      setErro('Selecione uma imagem para a promoção.')
      return
    }

    setErro(null)
    setSalvando(true)

    const payload = {
      link: form.link || null,
      ativo: form.ativo,
      imagemUrl: form.imagemUrl || null,
    }

    try {
      if (editando) {
        await api.atualizarPromocao(id, payload, arquivoImagem)
      } else {
        await api.criarPromocao(payload, arquivoImagem)
      }
      navigate('/admin/promocoes')
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
          <h2>{editando ? 'Editar promoção' : 'Nova promoção'}</h2>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form__imagem-preview">
            {imagemAtual ? <img src={imagemAtual} alt="Pré-visualização" /> : <IconImage />}
          </div>

          <label>
            {editando ? 'Trocar imagem da promoção' : 'Imagem da promoção'}
            <input type="file" accept="image/*" onChange={handleImagemSelecionada} />
          </label>
          {editando && !arquivoImagem && (
            <p className="admin-form__hint">Deixe em branco para manter a imagem atual.</p>
          )}

          <label>
            Link (pra onde o clique leva — deixe em branco se não levar a lugar nenhum)
            <input
              type="text"
              placeholder="Ex: /loja ou /loja?marca=Nike"
              value={form.link}
              onChange={campo('link')}
            />
          </label>

          <label className="admin-form__checkbox">
            <input type="checkbox" checked={form.ativo} onChange={campo('ativo')} />
            Exibir no carrossel da home
          </label>

          {erro && <p className="auth-form__erro">{erro}</p>}

          <div className="admin-form__actions">
            <button type="submit" className="btn btn--gold" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar promoção'}
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => navigate('/admin/promocoes')}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
