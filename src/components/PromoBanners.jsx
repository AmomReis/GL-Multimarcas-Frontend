import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { promos } from '../data/promos'

const SWIPE_MINIMO_PX = 40

export default function PromoBanners() {
  const [indice, setIndice] = useState(0)
  const pausado = useRef(false)
  const touchStartX = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => {
      if (!pausado.current) {
        setIndice((i) => (i + 1) % promos.length)
      }
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  function ir(delta) {
    setIndice((i) => (i + delta + promos.length) % promos.length)
  }

  function handleTouchStart(e) {
    pausado.current = true
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e) {
    pausado.current = false
    if (touchStartX.current === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(deltaX) > SWIPE_MINIMO_PX) {
      ir(deltaX < 0 ? 1 : -1)
    }
    touchStartX.current = null
  }

  return (
    <section
      className="promo-banners"
      aria-label="Promoções"
      onMouseEnter={() => (pausado.current = true)}
      onMouseLeave={() => (pausado.current = false)}
    >
      <div className="promo-banners__viewport">
        <div
          className="promo-banners__track"
          style={{ transform: `translateX(-${indice * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {promos.map((p) => (
            <div className="promo-banner" key={p.id}>
              <span className="promo-banner__selo">{p.selo}</span>
              <h3>{p.titulo}</h3>
              <p>{p.texto}</p>
              <Link to={p.to} className="btn btn--dark btn--sm-inline">
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className="promo-banners__arrow promo-banners__arrow--prev"
        onClick={() => ir(-1)}
        aria-label="Promoção anterior"
      >
        ‹
      </button>
      <button
        type="button"
        className="promo-banners__arrow promo-banners__arrow--next"
        onClick={() => ir(1)}
        aria-label="Próxima promoção"
      >
        ›
      </button>

      <div className="promo-banners__dots">
        {promos.map((p, i) => (
          <button
            key={p.id}
            className={`promo-banners__dot ${i === indice ? 'is-active' : ''}`}
            onClick={() => setIndice(i)}
            aria-label={`Ir para promoção ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
