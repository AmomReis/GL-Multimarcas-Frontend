import { Link } from 'react-router-dom'
import GarmentIcon from './GarmentIcon'
import { IconBag } from './icons'
import { useCart } from '../context/CartContext'
import { montarUrlImagem } from '../lib/api'
import { flyToCart } from '../lib/flyToCart'
import coroa from '../assets/coroa.png'

function formatPrice(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function ProductCard({ produto }) {
  const { addItem } = useCart()
  const { id, nome, marca, preco, categoria, destaque, imagemUrl, estoque, tamanhos } = produto
  const semEstoque = estoque === 0
  const temTamanhos = Array.isArray(tamanhos) && tamanhos.length > 0

  function handleAdicionar(e) {
    e.preventDefault()
    if (semEstoque) return
    addItem({ id, nome, marca, preco, categoria, imagemUrl })
    const media = e.currentTarget.closest('.product-card')?.querySelector('.product-card__media > img, .product-card__media > svg')
    flyToCart(media)
  }

  return (
    <article className="product-card">
      <Link to={`/produto/${id}`} className="product-card__media">
        <span className="product-card__marca-badge">
          <img src={coroa} alt="" />
          <span>{marca}</span>
        </span>
        {destaque && <span className="product-card__badge">Destaque</span>}
        {imagemUrl ? (
          <img src={montarUrlImagem(imagemUrl)} alt={nome} className="product-card__img" />
        ) : (
          <GarmentIcon type={categoria} className="product-card__icon" />
        )}
      </Link>

      <div className="product-card__info">
        <Link to={`/produto/${id}`} className="product-card__name">
          {nome}
        </Link>

        <div className="product-card__price-row">
          <div>
            <p className="product-card__price">{formatPrice(preco)}</p>
            <p className="product-card__parcelas">ou 3x sem juros</p>
          </div>

          {temTamanhos ? (
            <Link
              to={`/produto/${id}`}
              className="product-card__cart-btn"
              aria-label={`Escolher tamanho de ${nome}`}
              title="Escolher tamanho"
            >
              <IconBag aria-hidden="true" />
            </Link>
          ) : (
            <button
              className="product-card__cart-btn"
              type="button"
              onClick={handleAdicionar}
              disabled={semEstoque}
              aria-label={semEstoque ? 'Sem estoque' : `Adicionar ${nome} à sacola`}
              title={semEstoque ? 'Sem estoque' : 'Adicionar à sacola'}
            >
              <IconBag aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
