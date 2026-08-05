import { Link } from 'react-router-dom'
import GarmentIcon from '../components/GarmentIcon'
import { useCart } from '../context/CartContext'
import { montarUrlImagem } from '../lib/api'

function formatPrice(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function Cart() {
  const { itens, updateQty, removeItem, totalPreco } = useCart()

  if (itens.length === 0) {
    return (
      <div className="pagina-status">
        <p>Sua sacola está vazia.</p>
        <Link to="/loja" className="btn btn--gold">Ver produtos</Link>
      </div>
    )
  }

  return (
    <section className="carrinho">
      <h1 className="section-title">Sua sacola</h1>

      <div className="carrinho__lista">
        {itens.map((item) => (
          <div className="carrinho__item" key={`${item.id}-${item.tamanho || ''}`}>
            <div className="carrinho__item-media">
              {item.imagemUrl ? (
                <img src={montarUrlImagem(item.imagemUrl)} alt={item.nome} className="carrinho__item-img" />
              ) : (
                <GarmentIcon type={item.categoria} className="carrinho__item-icon" />
              )}
            </div>

            <div className="carrinho__item-info">
              <p className="product-card__brand">{item.marca}</p>
              <p className="carrinho__item-nome">{item.nome}</p>
              {item.tamanho && <p className="carrinho__item-tamanho">Tamanho: {item.tamanho}</p>}
              <p className="carrinho__item-preco">{formatPrice(item.preco)}</p>
            </div>

            <div className="qtd-control">
              <button type="button" onClick={() => updateQty(item.id, item.tamanho, item.quantidade - 1)}>
                −
              </button>
              <span>{item.quantidade}</span>
              <button type="button" onClick={() => updateQty(item.id, item.tamanho, item.quantidade + 1)}>
                +
              </button>
            </div>

            <button
              type="button"
              className="carrinho__remover"
              onClick={() => removeItem(item.id, item.tamanho)}
              aria-label={`Remover ${item.nome}`}
            >
              Remover
            </button>
          </div>
        ))}
      </div>

      <div className="carrinho__resumo">
        <span>Total</span>
        <strong>{formatPrice(totalPreco)}</strong>
      </div>

      <Link to="/checkout" className="btn btn--gold btn--lg carrinho__checkout">
        Fechar pedido
      </Link>
    </section>
  )
}
