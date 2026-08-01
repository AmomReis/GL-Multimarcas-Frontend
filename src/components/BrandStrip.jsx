import { marcas } from '../data/products'

export default function BrandStrip() {
  return (
    <section id="marcas" className="brand-strip">
      <p className="section-label">Marcas que vestimos</p>
      <ul className="brand-strip__list">
        {marcas.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
    </section>
  )
}
