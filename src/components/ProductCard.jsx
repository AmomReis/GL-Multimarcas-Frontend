import { Link } from 'react-router-dom'
import GarmentIcon from './GarmentIcon'
import { IconCrown, IconStar, IconBag } from './icons'
import { useCart } from '../context/CartContext'
import { montarUrlImagem } from '../lib/api'

function formatPrice(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// O backend ainda não tem avaliação de clientes por produto — isso aqui é só
// um placeholder visual (determinístico a partir do id, pra não "piscar"
// toda vez que a página recarrega). Quando existir avaliação real no banco,
// troque essa função por produto.notaMedia / produto.totalAvaliacoes.
function notaMockDoProduto(id) {
  let hash = 0
  for (let i = 0; i < String(id).length; i++) {
    hash = (hash * 31 + String(id).charCodeAt(i)) % 1000
  }
  const nota = (4.6 + (hash % 40) / 100).toFixed(1) // entre 4.6 e 4.9
  const avaliacoes = 40 + (hash % 260) // entre 40 e ~300
  return { nota, avaliacoes }
}

export default function ProductCard({ produto }) {
  const { addItem } = useCart()
  const { id, nome, marca, preco, categoria, destaque, imagemUrl, estoque } = produto
  const semEstoque = estoque === 0
  const { nota } = notaMockDoProduto(id)

  function handleAdicionar(e) {
    e.preventDefault()
    if (semEstoque) return
    addItem({ id, nome, marca, preco, categoria, imagemUrl })
  }

  return (
    <article className="product-card">
      <Link to={`/produto/${id}`} className="product-card__media">
        <span className="product-card__marca-badge">
          <IconCrown aria-hidden="true" />
          {marca}
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

        <div className="product-card__rating" aria-label={`Avaliação ${nota} de 5`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <IconStar key={i} className="product-card__star" aria-hidden="true" />
          ))}
          <span className="product-card__rating-num">({nota})</span>
        </div>

        <div className="product-card__price-row">
          <div>
            <p className="product-card__price">{formatPrice(preco)}</p>
            <p className="product-card__parcelas">ou 3x sem juros</p>
          </div>

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
        </div>
      </div>
    </article>
  )
}
