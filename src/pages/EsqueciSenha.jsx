import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'

export default function EsqueciSenha() {
  const [email, setEmail] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setEnviando(true)
    setErro(null)
    try {
      await api.esqueciSenha(email)
      setEnviado(true)
    } catch (e2) {
      setErro(e2.message)
    } finally {
      setEnviando(false)
    }
  }

  if (enviado) {
    return (
      <section className="auth-page">
        <h1 className="section-title">Verifique seu e-mail</h1>
        <p className="auth-page__subtitulo">
          Se {email} tiver uma conta na GL Multimarcas, enviamos um link pra redefinir a senha.
          O link vale por 1 hora.
        </p>
        <p className="auth-page__rodape">
          <Link to="/entrar">Voltar pro login</Link>
        </p>
      </section>
    )
  }

  return (
    <section className="auth-page">
      <h1 className="section-title">Esqueci minha senha</h1>
      <p className="auth-page__subtitulo">Informe seu e-mail pra receber um link de redefinição.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          E-mail
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        {erro && <p className="auth-form__erro">{erro}</p>}

        <button type="submit" className="btn btn--gold btn--lg" disabled={enviando}>
          {enviando ? 'Enviando...' : 'Enviar link de redefinição'}
        </button>
      </form>

      <p className="auth-page__rodape">
        <Link to="/entrar">Voltar pro login</Link>
      </p>
    </section>
  )
}
