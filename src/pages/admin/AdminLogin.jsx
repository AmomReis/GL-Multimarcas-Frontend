import { useState } from 'react'
import { Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function AdminLogin() {
  const { login, autenticado, user, carregando, erro } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const destino = location.state?.from?.pathname || '/admin'
  const sessaoExpirada = searchParams.get('expirada') === '1'

  if (autenticado && user?.admin) {
    return <Navigate to={destino} replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const ok = await login(email, senha)
    if (ok) navigate(destino, { replace: true })
  }

  return (
    <section className="auth-page">
      <h1 className="section-title">Painel Admin</h1>
      <p className="auth-page__subtitulo">Acesso restrito à equipe da GL Multimarcas.</p>

      {sessaoExpirada && (
        <p className="auth-form__erro">Sua sessão expirou. Faça login novamente.</p>
      )}

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

        <label>
          Senha
          <input
            type="password"
            required
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </label>

        {erro && <p className="auth-form__erro">{erro}</p>}

        <button type="submit" className="btn btn--gold btn--lg" disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </section>
  )
}
