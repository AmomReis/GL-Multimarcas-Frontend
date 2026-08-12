import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="pagina-status">
      <p className="pagina-status__codigo">404</p>
      <p className="pagina-status__titulo">Página não encontrada</p>
      <p>O link pode estar errado ou a página saiu do ar.</p>
      <div className="pagina-status__acoes">
        <Link to="/" className="btn btn--gold">Voltar para o início</Link>
        <Link to="/loja" className="btn btn--outline">Ver catálogo</Link>
      </div>
    </div>
  )
}
