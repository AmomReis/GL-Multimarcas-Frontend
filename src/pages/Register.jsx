import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PasswordInput from '../components/PasswordInput'

export default function Register() {
  const { registrar, carregando, erro } = useAuth()
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const ok = await registrar(nome, email, senha)
    if (ok) navigate('/', { replace: true })
  }

  return (
    <section className="auth-page">
      <h1 className="section-title">Criar conta</h1>
      <p className="auth-page__subtitulo">
        Cadastre-se e ganhe 10% de desconto na primeira compra.
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Nome
          <input
            type="text"
            required
            autoComplete="name"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </label>

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
          <PasswordInput
            required
            minLength={6}
            autoComplete="new-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </label>

        {erro && <p className="auth-form__erro">{erro}</p>}

        <button type="submit" className="btn btn--gold btn--lg" disabled={carregando}>
          {carregando ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>

      <p className="auth-page__rodape">
        Já tem conta? <Link to="/entrar">Entrar</Link>
      </p>
    </section>
  )
}
