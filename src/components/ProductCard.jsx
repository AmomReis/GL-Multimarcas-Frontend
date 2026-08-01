import { Link } from 'react-router-dom'
import GarmentIcon from './GarmentIcon'
import { useCart } from '../context/CartContext'
import { montarUrlImagem } from '../lib/api'

function formatPrice(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function ProductCard({ produto }) {
  const { addItem } = useCart()
  const { id, nome, marca, preco, categoria, destaque, imagemUrl, estoque } = produto
  const semEstoque = estoque === 0

  function handleAdicionar(e) {
    e.preventDefault()
    if (semEstoque) return
    addItem({ id, nome, marca, preco, categoria, imagemUrl })
  }

  return (
    <article className="product-card">
      <Link to={`/produto/${id}`} className="product-card__media">
        {destaque && <span className="product-card__badge">✦ Destaque</span>}
        {imagemUrl ? (
          <img src={montarUrlImagem(imagemUrl)} alt={nome} className="product-card__img" />
        ) : (
          <GarmentIcon type={categoria} className="product-card__icon" />
        )}
      </Link>
      <div className="product-card__info">
        <p className="product-card__brand">{marca}</p>
        <Link to={`/produto/${id}`} className="product-card__name">
          {nome}
        </Link>
        <div className="product-card__price">
          <span>{formatPrice(preco)}</span>
        </div>
        <button
          className="btn btn--outline btn--sm"
          type="button"
          onClick={handleAdicionar}
          disabled={semEstoque}
        >
          {semEstoque ? 'Sem estoque' : 'Adicionar'}
        </button>
      </div>
    </article>
  )
}
