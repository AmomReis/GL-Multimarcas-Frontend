import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, montarUrlImagem } from '../lib/api'

const SWIPE_MINIMO_PX = 40

export default function PromoBanners() {
  const [promocoes, setPromocoes] = useState([])
  const [indice, setIndice] = useState(0)
  const pausado = useRef(false)
  const touchStartX = useRef(null)

  useEffect(() => {
    let ativo = true
    api
      .getPromocoes()
      .then((dados) => {
        if (ativo) setPromocoes(dados)
      })
      .catch(() => {})
    return () => {
      ativo = false
    }
  }, [])

  useEffect(() => {
    if (promocoes.length < 2) return
    const timer = setInterval(() => {
      if (!pausado.current) {
        setIndice((i) => (i + 1) % promocoes.length)
      }
    }, 5000)
    return () => clearInterval(timer)
  }, [promocoes.length])

  function ir(delta) {
    setIndice((i) => (i + delta + promocoes.length) % promocoes.length)
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

  // Sem promoção ativa cadastrada — não mostra o carrossel em vez de
  // exibir uma seção vazia.
  if (promocoes.length === 0) return null

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
          {promocoes.map((p) =>
            p.link ? (
              <Link to={p.link} className="promo-banner" key={p.id}>
                <img src={montarUrlImagem(p.imagemUrl)} alt="Promoção" />
              </Link>
            ) : (
              <div className="promo-banner" key={p.id}>
                <img src={montarUrlImagem(p.imagemUrl)} alt="Promoção" />
              </div>
            ),
          )}
        </div>
      </div>

      {promocoes.length > 1 && (
        <>
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
            {promocoes.map((p, i) => (
              <button
                key={p.id}
                className={`promo-banners__dot ${i === indice ? 'is-active' : ''}`}
                onClick={() => setIndice(i)}
                aria-label={`Ir para promoção ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
