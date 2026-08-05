import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api, CATEGORIA_LABEL, montarUrlImagem } from '../lib/api'
import { products as mockProducts } from '../data/products'
import GarmentIcon from '../components/GarmentIcon'
import { useCart } from '../context/CartContext'
import { flyToCart } from '../lib/flyToCart'

function formatPrice(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const [produto, setProduto] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [quantidade, setQuantidade] = useState(1)
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState(null)
  const [erroTamanho, setErroTamanho] = useState(false)
  const [adicionado, setAdicionado] = useState(false)
  const mediaRef = useRef(null)

  useEffect(() => {
    let ativo = true
    setCarregando(true)
    setAdicionado(false)
    setTamanhoSelecionado(null)
    setErroTamanho(false)

    api
      .getProduto(id)
      .then((dados) => ativo && setProduto(dados))
      .catch(() => {
        const encontrado = mockProducts.find((p) => String(p.id) === String(id))
        if (ativo) setProduto(encontrado || null)
      })
      .finally(() => ativo && setCarregando(false))

    return () => {
      ativo = false
    }
  }, [id])

  if (carregando) {
    return <p className="vitrine__status pagina-status">Carregando produto...</p>
  }

  if (!produto) {
    return (
      <div className="pagina-status">
        <p>Não encontramos esse produto.</p>
        <Link to="/loja" className="btn btn--gold">Voltar para a loja</Link>
      </div>
    )
  }

  const semEstoque = produto.estoque === 0
  const temTamanhos = Array.isArray(produto.tamanhos) && produto.tamanhos.length > 0

  function handleAdicionar() {
    if (semEstoque) return
    if (temTamanhos && !tamanhoSelecionado) {
      setErroTamanho(true)
      return
    }

    addItem(
      {
        id: produto.id,
        nome: produto.nome,
        marca: produto.marca,
        preco: produto.preco,
        categoria: produto.categoria,
        imagemUrl: produto.imagemUrl,
        tamanho: tamanhoSelecionado,
      },
      quantidade,
    )
    setAdicionado(true)
    flyToCart(mediaRef.current?.querySelector('img, svg'))
  }

  function handleSelecionarTamanho(tamanho) {
    setTamanhoSelecionado(tamanho)
    setErroTamanho(false)
  }

  return (
    <section className="produto-detalhe">
      <button type="button" className="btn-voltar" onClick={() => navigate(-1)}>
        ← Voltar
      </button>

      <div className="produto-detalhe__grid">
        <div className="produto-detalhe__media" ref={mediaRef}>
          {produto.imagemUrl ? (
            <img src={montarUrlImagem(produto.imagemUrl)} alt={produto.nome} className="produto-detalhe__img" />
          ) : (
            <GarmentIcon type={produto.categoria} className="produto-detalhe__icon" />
          )}
        </div>

        <div className="produto-detalhe__info">
          <p className="product-card__brand">
            {produto.marca} · {CATEGORIA_LABEL[produto.categoria] || produto.categoria}
          </p>
          <h1>{produto.nome}</h1>

          <div className="product-card__price produto-detalhe__preco">
            <span>{formatPrice(produto.preco)}</span>
          </div>

          {temTamanhos && (
            <div className="produto-detalhe__tamanhos">
              <span className="produto-detalhe__tamanhos-label">
                Tamanho{tamanhoSelecionado ? `: ${tamanhoSelecionado}` : ''}
              </span>
              <div className="tamanho-selector">
                {produto.tamanhos.map((tamanho) => (
                  <button
                    key={tamanho}
                    type="button"
                    className={`tamanho-chip ${tamanhoSelecionado === tamanho ? 'is-selected' : ''}`}
                    onClick={() => handleSelecionarTamanho(tamanho)}
                    aria-pressed={tamanhoSelecionado === tamanho}
                  >
                    {tamanho}
                  </button>
                ))}
              </div>
              {erroTamanho && <p className="produto-detalhe__tamanho-erro">Escolha um tamanho antes de continuar.</p>}
            </div>
          )}

          <p className="produto-detalhe__descricao">
            {produto.descricao || 'Peça selecionada na curadoria GL Multimarcas.'}
          </p>

          {semEstoque ? (
            <p className="produto-detalhe__sem-estoque">Produto sem estoque no momento.</p>
          ) : (
            <>
              <div className="produto-detalhe__qtd">
                <span>Quantidade</span>
                <div className="qtd-control">
                  <button type="button" onClick={() => setQuantidade((q) => Math.max(1, q - 1))}>
                    −
                  </button>
                  <span>{quantidade}</span>
                  <button
                    type="button"
                    onClick={() => setQuantidade((q) => Math.min(produto.estoque, q + 1))}
                  >
                    +
                  </button>
                </div>
              </div>

              <button type="button" className="btn btn--gold btn--lg" onClick={handleAdicionar}>
                Adicionar à sacola
              </button>
            </>
          )}

          {adicionado && (
            <p className="produto-detalhe__confirmacao">
              Adicionado! <Link to="/carrinho">Ver sacola →</Link>
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
