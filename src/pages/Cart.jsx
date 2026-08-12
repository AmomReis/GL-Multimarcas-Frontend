import { Link } from 'react-router-dom'
import GarmentIcon from '../components/GarmentIcon'
import { IconTrash, IconBagEmpty, IconTruck } from '../components/icons'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { montarUrlImagem } from '../lib/api'

function formatPrice(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// Mesmo valor anunciado no TopBar e nos diferenciais — se mudar lá, muda aqui.
const FRETE_GRATIS_A_PARTIR_DE = 299

export default function Cart() {
  const { itens, updateQty, removeItem, totalPreco, totalItens } = useCart()
  const { showToast } = useToast()

  if (itens.length === 0) {
    return (
      <div className="pagina-status">
        <IconBagEmpty className="pagina-status__icon" aria-hidden="true" />
        <p className="pagina-status__titulo">Sua sacola está vazia</p>
        <p>Escolha suas peças e elas aparecem aqui.</p>
        <Link to="/loja" className="btn btn--gold btn--lg">Ver produtos</Link>
      </div>
    )
  }

  const faltaPraFreteGratis = FRETE_GRATIS_A_PARTIR_DE - totalPreco
  const progressoFrete = Math.min(100, (totalPreco / FRETE_GRATIS_A_PARTIR_DE) * 100)

  function handleRemover(item) {
    removeItem(item.id, item.tamanho)
    showToast(`${item.nome} saiu da sacola`, { tipo: 'info' })
  }

  return (
    <section className="carrinho">
      <h1 className="section-title">Sua sacola</h1>
      <p className="carrinho__contagem">
        {totalItens} {totalItens === 1 ? 'item' : 'itens'}
      </p>

      <div className="frete-progresso">
        <p className="frete-progresso__texto">
          <IconTruck aria-hidden="true" />
          {faltaPraFreteGratis > 0 ? (
            <>
              Faltam <strong>{formatPrice(faltaPraFreteGratis)}</strong> para o frete grátis
            </>
          ) : (
            <>
              <strong>Frete grátis</strong> liberado nesta compra
            </>
          )}
        </p>
        <div
          className="frete-progresso__barra"
          role="progressbar"
          aria-valuenow={Math.round(progressoFrete)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progresso para frete grátis"
        >
          <span style={{ width: `${progressoFrete}%` }} />
        </div>
      </div>

      <ul className="carrinho__lista">
        {itens.map((item) => (
          <li className="carrinho__item" key={`${item.id}-${item.tamanho || ''}`}>
            <Link to={`/produto/${item.id}`} className="carrinho__item-media">
              {item.imagemUrl ? (
                <img
                  src={montarUrlImagem(item.imagemUrl)}
                  alt={item.nome}
                  className="carrinho__item-img"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <GarmentIcon type={item.categoria} className="carrinho__item-icon" />
              )}
            </Link>

            <div className="carrinho__item-info">
              <p className="carrinho__item-marca">{item.marca}</p>
              <Link to={`/produto/${item.id}`} className="carrinho__item-nome">
                {item.nome}
              </Link>
              {item.tamanho && <p className="carrinho__item-tamanho">Tamanho: {item.tamanho}</p>}
              <p className="carrinho__item-preco">
                {formatPrice(item.preco)}
                {item.quantidade > 1 && (
                  <span className="carrinho__item-subtotal">
                    {' '}· {formatPrice(item.preco * item.quantidade)}
                  </span>
                )}
              </p>
            </div>

            <div className="qtd-control">
              <button
                type="button"
                onClick={() => updateQty(item.id, item.tamanho, item.quantidade - 1)}
                disabled={item.quantidade <= 1}
                aria-label={`Diminuir quantidade de ${item.nome}`}
              >
                −
              </button>
              <span>{item.quantidade}</span>
              <button
                type="button"
                onClick={() => updateQty(item.id, item.tamanho, item.quantidade + 1)}
                aria-label={`Aumentar quantidade de ${item.nome}`}
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="carrinho__remover"
              onClick={() => handleRemover(item)}
              aria-label={`Remover ${item.nome} da sacola`}
            >
              <IconTrash aria-hidden="true" />
              <span>Remover</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="carrinho__resumo">
        <div className="carrinho__resumo-linha">
          <span>Subtotal</span>
          <span>{formatPrice(totalPreco)}</span>
        </div>
        <div className="carrinho__resumo-linha carrinho__resumo-linha--frete">
          <span>Frete</span>
          <span>{faltaPraFreteGratis > 0 ? 'calculado no pagamento' : 'grátis'}</span>
        </div>
        <div className="carrinho__resumo-linha carrinho__resumo-linha--total">
          <span>Total</span>
          <strong>{formatPrice(totalPreco)}</strong>
        </div>
      </div>

      <Link to="/checkout" className="btn btn--gold btn--lg carrinho__checkout">
        Fechar pedido
      </Link>

      <Link to="/loja" className="carrinho__continuar">
        Continuar comprando
      </Link>
    </section>
  )
}
