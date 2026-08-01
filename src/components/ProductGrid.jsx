import { useEffect, useState } from 'react'
import { api, CATEGORIAS, CATEGORIA_LABEL } from '../lib/api'
import { products as mockProducts } from '../data/products'
import ProductCard from './ProductCard'

export default function ProductGrid({ titulo = 'Peças da semana', apenasDestaque = false, limite }) {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [usandoMock, setUsandoMock] = useState(false)
  const [categoria, setCategoria] = useState('')

  useEffect(() => {
    let ativo = true
    setCarregando(true)

    const filtros = {}
    if (categoria) filtros.categoria = categoria
    if (apenasDestaque) filtros.destaque = true

    api
      .getProdutos(filtros)
      .then((dados) => {
        if (ativo) {
          setProdutos(dados)
          setUsandoMock(false)
        }
      })
      .catch(() => {
        // Backend indisponível — usa os dados de exemplo pra não travar a vitrine.
        if (ativo) {
          let dados = mockProducts
          if (categoria) dados = dados.filter((p) => p.categoria === categoria)
          if (apenasDestaque) dados = dados.filter((p) => p.destaque)
          setProdutos(dados)
          setUsandoMock(true)
        }
      })
      .finally(() => ativo && setCarregando(false))

    return () => {
      ativo = false
    }
  }, [categoria, apenasDestaque])

  const visiveis = limite ? produtos.slice(0, limite) : produtos

  return (
    <section id="vitrine" className="vitrine">
      <div className="vitrine__header">
        <div>
          <p className="section-label">Vitrine</p>
          <h2 className="section-title">{titulo}</h2>
        </div>

        {!limite && (
          <div className="vitrine__filtros" role="group" aria-label="Filtrar por categoria">
            <button
              type="button"
              className={`chip ${categoria === '' ? 'chip--active' : ''}`}
              onClick={() => setCategoria('')}
            >
              Todas
            </button>
            {CATEGORIAS.map((c) => (
              <button
                key={c}
                type="button"
                className={`chip ${categoria === c ? 'chip--active' : ''}`}
                onClick={() => setCategoria(c)}
              >
                {CATEGORIA_LABEL[c] || c}
              </button>
            ))}
          </div>
        )}
      </div>

      {usandoMock && (
        <p className="vitrine__status">
          Não consegui falar com o backend agora — mostrando produtos de exemplo.
        </p>
      )}

      {carregando ? (
        <p className="vitrine__status">Carregando produtos...</p>
      ) : visiveis.length === 0 ? (
        <p className="vitrine__status">Nenhum produto encontrado nessa categoria.</p>
      ) : (
        <div className="vitrine__grid">
          {visiveis.map((p) => (
            <ProductCard key={p.id} produto={p} />
          ))}
        </div>
      )}
    </section>
  )
}
