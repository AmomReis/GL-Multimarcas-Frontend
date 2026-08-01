import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import PromoBanners from '../components/PromoBanners'
import BrandStrip from '../components/BrandStrip'
import ProductGrid from '../components/ProductGrid'
import ValueProps from '../components/ValueProps'
import Newsletter from '../components/Newsletter'

export default function Home() {
  return (
    <>
      <Hero />
      <PromoBanners />
      <BrandStrip />
      <ProductGrid titulo="Destaques" apenasDestaque limite={4} />
      <div className="ver-loja-cta">
        <Link to="/loja" className="btn btn--ghost">Ver todos os produtos</Link>
      </div>
      <ValueProps />
      <Newsletter />
    </>
  )
}
