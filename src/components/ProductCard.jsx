import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import GarmentIcon from './GarmentIcon'
import { IconBag } from './icons'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { montarUrlImagem } from '../lib/api'
import { flyToCart } from '../lib/flyToCart'
import coroa from '../assets/coroa.png'

function formatPrice(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// A partir daqui vale a pena avisar "últimas unidades": abaixo disso a
// urgência é real, acima vira só barulho.
const LIMIAR_POUCO_ESTOQUE = 3

export default function ProductCard({ produto, prioridade = false }) {
  const { addItem } = useCart()
  const { showToast } = useToast()
  const [imagemCarregada, setImagemCarregada] = useState(false)
  const { id, nome, marca, preco, categoria, destaque, imagemUrl, estoque, tamanhos } = produto

  // Imagem que já está no cache do navegador pode terminar de carregar
  // antes do onLoad ser ligado — sem esta checagem o card ficaria com a
  // foto em opacity: 0 pra sempre (produto "invisível" ao voltar pra loja).
  const imgRef = useCallback((node) => {
    if (node?.complete) setImagemCarregada(true)
  }, [])

  const semEstoque = estoque === 0
  const poucoEstoque = typeof estoque === 'number' && estoque > 0 && estoque <= LIMIAR_POUCO_ESTOQUE
  const temTamanhos = Array.isArray(tamanhos) && tamanhos.length > 0

  function handleAdicionar(e) {
    e.preventDefault()
    if (semEstoque) return
    addItem({ id, nome, marca, preco, categoria, imagemUrl })
    const media = e.currentTarget
      .closest('.product-card')
      ?.querySelector('.product-card__media img, .product-card__media svg')
    flyToCart(media)
    showToast(`${nome} foi para a sacola`, { tipo: 'sucesso' })
  }

  return (
    <article className={`product-card ${semEstoque ? 'is-esgotado' : ''}`}>
      <Link to={`/produto/${id}`} className="product-card__media">
        <div className="product-card__badges">
          <span className="product-card__marca-badge">
            <img src={coroa} alt="" />
            <span>{marca}</span>
          </span>
          {destaque && <span className="product-card__badge">Destaque</span>}
        </div>

        {imagemUrl ? (
          <img
            ref={imgRef}
            src={montarUrlImagem(imagemUrl)}
            alt={nome}
            className={`product-card__img ${imagemCarregada ? 'is-loaded' : ''}`}
            /* Os primeiros cards da vitrine entram na primeira dobra: adiar
               a imagem deles só atrasaria o LCP. Do resto pra baixo, lazy. */
            loading={prioridade ? 'eager' : 'lazy'}
            /* minúsculo: o React 18 não reconhece `fetchPriority`. */
            fetchpriority={prioridade ? 'high' : 'auto'}
            decoding="async"
            onLoad={() => setImagemCarregada(true)}
            onError={() => setImagemCarregada(true)}
          />
        ) : (
          <GarmentIcon type={categoria} className="product-card__icon" />
        )}

        {semEstoque && <span className="product-card__esgotado">Esgotado</span>}
        {poucoEstoque && (
          <span className="product-card__estoque-aviso">
            Últim{estoque === 1 ? 'a unidade' : `as ${estoque} unidades`}
          </span>
        )}
      </Link>

      <div className="product-card__info">
        <Link to={`/produto/${id}`} className="product-card__name">
          {nome}
        </Link>

        <div className="product-card__price-row">
          <div className="product-card__price-box">
            <p className="product-card__price">{formatPrice(preco)}</p>
            {/* Sem "sem juros" aqui de propósito: com o botão da sacola ao
                lado sobram ~120px, e a frase inteira quebrava em duas linhas
                desalinhando os cards. A condição completa está na página do
                produto e nos diferenciais. */}
            <p className="product-card__parcelas">3x de {formatPrice(preco / 3)}</p>
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
              aria-label={semEstoque ? `${nome} está sem estoque` : `Adicionar ${nome} à sacola`}
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
