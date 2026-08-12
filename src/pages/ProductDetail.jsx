import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api, CATEGORIA_LABEL, montarUrlImagem } from '../lib/api'
import { products as mockProducts } from '../data/products'
import GarmentIcon from '../components/GarmentIcon'
import { IconChevronRight, IconShield, IconTruck, IconRefresh, IconBagEmpty } from '../components/icons'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { flyToCart } from '../lib/flyToCart'

function formatPrice(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const GARANTIAS = [
  { icone: IconShield, texto: 'Peça original conferida' },
  { icone: IconTruck, texto: 'Frete grátis acima de R$ 299' },
  { icone: IconRefresh, texto: '30 dias para trocar' },
]

function ProdutoSkeleton() {
  return (
    <section className="produto-detalhe" aria-busy="true">
      <div className="produto-detalhe__grid">
        <div className="produto-detalhe__media skeleton" />
        <div className="produto-detalhe__info">
          <span className="skeleton skeleton--linha" style={{ width: '40%' }} />
          <span className="skeleton skeleton--linha skeleton--linha-titulo" />
          <span className="skeleton skeleton--linha" style={{ width: '30%' }} />
          <span className="skeleton skeleton--bloco" />
          <span className="skeleton skeleton--botao" />
        </div>
      </div>
    </section>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { showToast } = useToast()
  const [produto, setProduto] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [quantidade, setQuantidade] = useState(1)
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState(null)
  const [erroTamanho, setErroTamanho] = useState(false)
  const [adicionado, setAdicionado] = useState(false)
  const mediaRef = useRef(null)
  const tamanhosRef = useRef(null)

  useEffect(() => {
    let ativo = true
    setCarregando(true)
    setAdicionado(false)
    setTamanhoSelecionado(null)
    setErroTamanho(false)
    setQuantidade(1)

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
    return <ProdutoSkeleton />
  }

  if (!produto) {
    return (
      <div className="pagina-status">
        <IconBagEmpty className="pagina-status__icon" aria-hidden="true" />
        <p className="pagina-status__titulo">Não encontramos esse produto</p>
        <p>Ele pode ter saído do catálogo.</p>
        <Link to="/loja" className="btn btn--gold">Voltar para a loja</Link>
      </div>
    )
  }

  const semEstoque = produto.estoque === 0
  const temTamanhos = Array.isArray(produto.tamanhos) && produto.tamanhos.length > 0
  const categoriaLabel = CATEGORIA_LABEL[produto.categoria] || produto.categoria

  function handleAdicionar() {
    if (semEstoque) return
    if (temTamanhos && !tamanhoSelecionado) {
      setErroTamanho(true)
      // Sem isso, quem toca no botão fixo do rodapé no celular recebe um
      // erro sobre um seletor que está fora da tela.
      tamanhosRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
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
    showToast(
      `${quantidade}x ${produto.nome}${tamanhoSelecionado ? ` (${tamanhoSelecionado})` : ''} na sacola`,
      { tipo: 'sucesso' },
    )
  }

  function handleSelecionarTamanho(tamanho) {
    setTamanhoSelecionado(tamanho)
    setErroTamanho(false)
  }

  return (
    <section className="produto-detalhe">
      <nav className="breadcrumb" aria-label="Você está em">
        <Link to="/">Início</Link>
        <IconChevronRight aria-hidden="true" />
        <Link to="/loja">Catálogo</Link>
        <IconChevronRight aria-hidden="true" />
        <span aria-current="page">{produto.nome}</span>
      </nav>

      <button type="button" className="btn-voltar" onClick={() => navigate(-1)}>
        ← Voltar
      </button>

      <div className="produto-detalhe__grid">
        <div className="produto-detalhe__media" ref={mediaRef}>
          {produto.imagemUrl ? (
            <img
              src={montarUrlImagem(produto.imagemUrl)}
              alt={produto.nome}
              className="produto-detalhe__img"
              decoding="async"
              fetchpriority="high"
            />
          ) : (
            <GarmentIcon type={produto.categoria} className="produto-detalhe__icon" />
          )}
          {semEstoque && <span className="produto-detalhe__selo-esgotado">Esgotado</span>}
        </div>

        <div className="produto-detalhe__info">
          <p className="produto-detalhe__marca">
            {produto.marca} · {categoriaLabel}
          </p>
          <h1>{produto.nome}</h1>

          <div className="produto-detalhe__preco">
            <span className="produto-detalhe__preco-valor">{formatPrice(produto.preco)}</span>
            <span className="produto-detalhe__preco-parcelas">
              ou 3x de {formatPrice(produto.preco / 3)} sem juros
            </span>
          </div>

          {temTamanhos && (
            <div className="produto-detalhe__tamanhos" ref={tamanhosRef}>
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
              {erroTamanho && (
                <p className="produto-detalhe__tamanho-erro" role="alert">
                  Escolha um tamanho antes de continuar.
                </p>
              )}
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
                  <button
                    type="button"
                    onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                    disabled={quantidade <= 1}
                    aria-label="Diminuir quantidade"
                  >
                    −
                  </button>
                  <span aria-live="polite">{quantidade}</span>
                  <button
                    type="button"
                    onClick={() => setQuantidade((q) => Math.min(produto.estoque, q + 1))}
                    disabled={quantidade >= produto.estoque}
                    aria-label="Aumentar quantidade"
                  >
                    +
                  </button>
                </div>
                {produto.estoque <= 5 && (
                  <span className="produto-detalhe__estoque-aviso">
                    {produto.estoque} em estoque
                  </span>
                )}
              </div>

              <button
                type="button"
                className="btn btn--gold btn--lg produto-detalhe__cta"
                onClick={handleAdicionar}
              >
                Adicionar à sacola
              </button>
            </>
          )}

          {adicionado && (
            <p className="produto-detalhe__confirmacao">
              Adicionado! <Link to="/carrinho">Ver sacola →</Link>
            </p>
          )}

          <ul className="produto-detalhe__garantias">
            {GARANTIAS.map(({ icone: Icone, texto }) => (
              <li key={texto}>
                <Icone aria-hidden="true" />
                {texto}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Barra de compra fixa — só no celular (CSS). Repete preço e ação
          principal pra que "adicionar" nunca fique fora da tela enquanto a
          pessoa lê a descrição. */}
      {!semEstoque && (
        <div className="compra-bar">
          <div className="compra-bar__info">
            <span className="compra-bar__preco">{formatPrice(produto.preco * quantidade)}</span>
            <span className="compra-bar__detalhe">
              {quantidade}x{tamanhoSelecionado ? ` · Tam. ${tamanhoSelecionado}` : temTamanhos ? ' · escolha o tamanho' : ''}
            </span>
          </div>
          <button type="button" className="btn btn--gold compra-bar__btn" onClick={handleAdicionar}>
            Adicionar
          </button>
        </div>
      )}
    </section>
  )
}
