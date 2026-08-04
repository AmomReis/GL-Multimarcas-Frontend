import { Link } from 'react-router-dom'
import { IconCrown } from './icons'

// Marcas em destaque na navegação rápida da home. Ajuste essa lista conforme
// as marcas que você realmente cadastrar no catálogo (campo `marca` do produto).
const marcasDestaque = ['Nike', 'Adidas', 'Lacoste', 'Diesel', 'Tommy Hilfiger', 'Puma']

export default function BrandStrip() {
  return (
    <section id="marcas" className="brand-nav">
      <h2 className="section-title">
        Navegue por <span className="text-gold">marca</span>
      </h2>

      <div className="brand-nav__grid">
        {marcasDestaque.map((marca) => (
          <Link
            key={marca}
            to={`/loja?marca=${encodeURIComponent(marca)}`}
            className="brand-nav__pill"
          >
            <IconCrown className="brand-nav__pill-icon" aria-hidden="true" />
            {marca}
          </Link>
        ))}
      </div>
    </section>
  )
}
