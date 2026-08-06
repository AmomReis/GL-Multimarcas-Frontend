import { Link } from 'react-router-dom'
import { IconStar } from './icons'
import coroa from '../assets/coroa.png'

// Placeholder — troque pela foto real do catálogo/campanha da GL assim que tiver uma.
const IMAGEM_HERO = 'https://images.hostinger.com/9fd9a776-bd91-470d-95fa-a3a743569961.png'

export default function Hero() {
  return (
    <section id="topo" className="hero">
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__content">
        <span className="hero__badge">
          <img src={coroa} alt="" className="hero__badge-icon" />
          Coleção 2025
        </span>

        <h1 className="hero__title">
          VISTA-SE COMO 
          <br />
          <span className="text-gold-shine">QUEM MANDA</span>
        </h1>

        <div className="hero__divider" aria-hidden="true" />

        <p className="hero__subtitle">
          Nike, Adidas, Lacoste, Diesel e outras grifes selecionadas.
          Autenticidade garantida, entrega rápida e atendimento de verdade.
        </p>

        <div className="hero__actions hero__actions--stack">
          <Link to="/loja" className="btn btn--gold btn--lg">
            Ver catálogo →
          </Link>
          <Link to="/loja?destaque=1" className="btn btn--outline btn--lg">
            Ofertas da semana
          </Link>
        </div>

        <div className="hero__media">
          <img src={IMAGEM_HERO} alt="Modelo vestindo peça da curadoria GL Multimarcas" />
          <div className="hero__stat">
            <span className="hero__stat-nota">
              <IconStar className="hero__stat-star" aria-hidden="true" />
              4.9/5
            </span>
            <span className="hero__stat-legenda">+2.400 clientes</span>
          </div>
        </div>
      </div>
    </section>
  )
}
