import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import coroa from '../assets/coroa.png'

// Marcas de fallback pra navegação rápida da home, usadas só se o backend
// estiver fora do ar — em uso normal a lista vem do cadastro de marcas.
const marcasFallback = ['Nike', 'Adidas', 'Lacoste', 'Diesel', 'Tommy Hilfiger', 'Puma']

export default function BrandStrip() {
  const [marcas, setMarcas] = useState(marcasFallback)

  useEffect(() => {
    let ativo = true
    api
      .getMarcas()
      .then((dados) => {
        if (ativo && dados.length > 0) setMarcas(dados.map((m) => m.nome))
      })
      .catch(() => {})
    return () => {
      ativo = false
    }
  }, [])

  return (
    <section id="marcas" className="brand-nav">
      <h2 className="section-title">
        Navegue por <span className="text-gold">marca</span>
      </h2>

      <div className="brand-nav__grid">
        {marcas.map((marca) => (
          <Link
            key={marca}
            to={`/loja?marca=${encodeURIComponent(marca)}`}
            className="brand-nav__pill"
          >
            <img src={coroa} alt="" className="brand-nav__pill-icon" />
            {marca}
          </Link>
        ))}
      </div>
    </section>
  )
}
