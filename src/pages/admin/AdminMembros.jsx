import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { IconUsers, IconSend } from '../../components/admin/AdminIcons'

const LIMITE_MENSAGEM = 600

export default function AdminMembros() {
  const [membros, setMembros] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erroLista, setErroLista] = useState(null)

  const [mensagem, setMensagem] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erroEnvio, setErroEnvio] = useState(null)
  const [enviado, setEnviado] = useState(false)

  useEffect(() => {
    let ativo = true
    api
      .getMembrosClube()
      .then((dados) => ativo && setMembros(dados))
      .catch((e) => ativo && setErroLista(e.message))
      .finally(() => ativo && setCarregando(false))
    return () => {
      ativo = false
    }
  }, [])

  async function handleEnviar(e) {
    e.preventDefault()
    const texto = mensagem.trim()
    if (!texto) return
    const quantos = membros.length ? `${membros.length} membros` : 'todos os membros'
    if (!window.confirm(`Enviar essa oferta para ${quantos} do Clube GL? Essa ação não pode ser desfeita.`)) return

    setEnviando(true)
    setErroEnvio(null)
    setEnviado(false)
    try {
      await api.enviarOfertaMembros(texto)
      setEnviado(true)
      setMensagem('')
    } catch (err) {
      setErroEnvio(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-card__icon">
            <IconUsers />
          </div>
          <p className="admin-stat-card__label">Membros do Clube GL</p>
          <p className="admin-stat-card__value">{carregando ? '—' : membros.length}</p>
          {erroLista && <p className="admin-stat-card__hint">Não deu pra carregar a lista: {erroLista}</p>}
        </div>
      </div>

      <section className="admin-section">
        <div className="admin-section__header">
          <h2>Enviar oferta em massa</h2>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: 0, marginBottom: '1.4rem' }}>
          A mensagem é enviada por e-mail e WhatsApp pra todo mundo que já se cadastrou no Clube GL pelo site.
        </p>

        <form className="admin-form" onSubmit={handleEnviar}>
          <label>
            Mensagem da oferta
            <textarea
              required
              rows={6}
              maxLength={LIMITE_MENSAGEM}
              placeholder="Ex: Chegou a nova coleção de inverno! Use o cupom CLUBEGL10 e ganhe 10% de desconto até domingo."
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
            />
          </label>
          <p style={{ color: 'var(--muted)', fontSize: '0.75rem', margin: '-0.6rem 0 0' }}>
            {mensagem.length}/{LIMITE_MENSAGEM} caracteres
          </p>

          {erroEnvio && <p className="auth-form__erro">{erroEnvio}</p>}
          {enviado && (
            <p style={{ color: 'var(--success)', fontSize: '0.85rem', margin: 0 }}>
              Oferta enviada com sucesso!
            </p>
          )}

          <button
            type="submit"
            className="btn btn--gold btn--lg"
            disabled={enviando || !mensagem.trim()}
            style={{ width: 'auto' }}
          >
            <IconSend style={{ width: 18, height: 18 }} />
            {enviando ? 'Enviando...' : 'Enviar pra todos os membros'}
          </button>
        </form>
      </section>
    </div>
  )
}
