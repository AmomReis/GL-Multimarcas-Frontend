import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api'

export default function RedefinirSenha() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  const [novaSenha, setNovaSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()

    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    setEnviando(true)
    setErro(null)
    try {
      await api.redefinirSenha(token, novaSenha)
      navigate('/entrar', { replace: true, state: { senhaRedefinida: true } })
    } catch (e2) {
      setErro(e2.message)
    } finally {
      setEnviando(false)
    }
  }

  if (!token) {
    return (
      <section className="auth-page">
        <h1 className="section-title">Link inválido</h1>
        <p className="auth-page__subtitulo">
          Esse link de redefinição de senha está incompleto. Peça um novo link.
        </p>
        <p className="auth-page__rodape">
          <Link to="/esqueci-senha">Pedir novo link</Link>
        </p>
      </section>
    )
  }

  return (
    <section className="auth-page">
      <h1 className="section-title">Redefinir senha</h1>
      <p className="auth-page__subtitulo">Escolha uma nova senha pra sua conta.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Nova senha
          <input
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
          />
        </label>

        <label>
          Confirmar nova senha
          <input
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />
        </label>

        {erro && <p className="auth-form__erro">{erro}</p>}

        <button type="submit" className="btn btn--gold btn--lg" disabled={enviando}>
          {enviando ? 'Salvando...' : 'Redefinir senha'}
        </button>
      </form>
    </section>
  )
}
