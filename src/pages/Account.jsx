import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Account() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleSair() {
    logout()
    navigate('/')
  }

  return (
    <section className="auth-page">
      <h1 className="section-title">Minha conta</h1>

      <div className="conta-info">
        <p><span>Nome</span>{user?.nome}</p>
        <p><span>E-mail</span>{user?.email}</p>
      </div>

      <button type="button" className="btn btn--ghost" onClick={handleSair}>
        Sair da conta
      </button>
    </section>
  )
}
