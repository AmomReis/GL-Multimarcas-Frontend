import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, carregando, erro } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  const destino = location.state?.from?.pathname || '/'

  async function handleSubmit(e) {
    e.preventDefault()
    const ok = await login(email, senha)
    if (ok) navigate(destino, { replace: true })
  }

  return (
    <section className="auth-page">
      <h1 className="section-title">Entrar</h1>
      <p className="auth-page__subtitulo">Acesse sua conta pra acompanhar seus pedidos.</p>
      {location.state?.senhaRedefinida && (
        <p className="auth-form__sucesso">Senha redefinida com sucesso. Entre com a nova senha.</p>
      )}

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          E-mail
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label>
          Senha
          <input
            type="password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </label>

        {erro && <p className="auth-form__erro">{erro}</p>}

        <button type="submit" className="btn btn--gold btn--lg" disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <p className="auth-page__rodape">
        <Link to="/esqueci-senha">Esqueci minha senha</Link>
      </p>
      <p className="auth-page__rodape">
        Não tem conta? <Link to="/cadastro">Criar conta</Link>
      </p>
    </section>
  )
}
