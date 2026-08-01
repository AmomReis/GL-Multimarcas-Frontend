import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="pagina-status">
      <p>Página não encontrada.</p>
      <Link to="/" className="btn btn--gold">Voltar para o início</Link>
    </div>
  )
}
