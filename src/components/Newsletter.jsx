import { useState } from 'react'
import { api } from '../lib/api'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    setEnviando(true)
    setErro(null)
    try {
      await api.cadastrarMembroClube(email)
      setEnviado(true)
    } catch (err) {
      setErro(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section id="clube" className="clube">
      <div className="clube__inner">
        <h2>
          Entre para o <span className="text-outline">Clube GL</span>
        </h2>
        <p>
          Acesso antecipado a novas coleções, descontos exclusivos e convite
          pros eventos da loja. Sem spam, só o essencial.
        </p>

        {enviado ? (
          <p className="clube__sucesso">
            Boa! Enviamos a confirmação para <strong>{email}</strong>.
          </p>
        ) : (
          <form className="clube__form" onSubmit={handleSubmit}>
            <input
              type="email"
              required
              autoComplete="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Seu e-mail"
            />
            <button type="submit" className="btn btn--dark" disabled={enviando}>
              {enviando ? 'Enviando...' : 'Quero entrar'}
            </button>
          </form>
        )}
        {erro && <p className="clube__erro">Não foi possível cadastrar: {erro}</p>}
      </div>
    </section>
  )
}
