import { Link } from 'react-router-dom'
import Marquee from './Marquee'
import logo from '../assets/logo.png'

export default function Hero() {
  return (
    <section id="topo" className="hero">
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__content">
        <img src={logo} alt="GL Multimarcas" className="hero__logo" />

        <p className="eyebrow">GL MULTIMARCAS · LOJA DE ROUPAS</p>
        <h1 className="hero__title">
          VISTA-SE
          <br />
          COMO <span className="text-gold">QUEM MANDA</span>
        </h1>
        <p className="hero__subtitle">
          Curadoria de várias marcas em um só lugar. Streetwear, social e
          básicos essenciais — selecionados pra quem tem estilo próprio e
          não segue padrão.
        </p>
        <div className="hero__actions">
          <Link to="/loja" className="btn btn--gold btn--lg">
            Ver loja
          </Link>
          <a href="#marcas" className="btn btn--ghost btn--lg">
            Conhecer as marcas
          </a>
        </div>
      </div>

      <Marquee />
    </section>
  )
}
