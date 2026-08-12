import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import { products as mockProducts } from '../data/products'
import ProductCard from './ProductCard'
import ProductCardSkeleton from './ProductCardSkeleton'
import { IconSearch, IconChevronDown, IconClose, IconBagEmpty, IconAlert } from './icons'

const ORDENACOES = [
  { valor: 'relevancia', label: 'Relevância' },
  { valor: 'menor-preco', label: 'Menor preço' },
  { valor: 'maior-preco', label: 'Maior preço' },
  { valor: 'nome', label: 'Nome (A-Z)' },
]

// Quantos cards da vitrine carregam a imagem sem lazy — cobre a primeira
// dobra no celular (2 colunas) e no desktop (4 colunas).
const CARDS_PRIORITARIOS = 4

// Quantos esqueletos mostrar enquanto carrega; o suficiente pra preencher
// a área visível sem inventar uma página inteira de conteúdo falso.
const SKELETONS = 6

function ordenar(lista, criterio) {
  const copia = [...lista]
  switch (criterio) {
    case 'menor-preco':
      return copia.sort((a, b) => a.preco - b.preco)
    case 'maior-preco':
      return copia.sort((a, b) => b.preco - a.preco)
    case 'nome':
      return copia.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
    default:
      return copia
  }
}

export default function ProductGrid({
  titulo = 'Peças da semana',
  apenasDestaque = false,
  limite,
  // 'marca' mostra chips de marca (catálogo); null/undefined esconde os controles.
  filtro = null,
  marcaInicial = '',
  mostrarBusca = false,
  mostrarOrdenacao = false,
}) {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [usandoMock, setUsandoMock] = useState(false)
  const [marca, setMarca] = useState(marcaInicial)
  const [busca, setBusca] = useState('')
  const [ordenacao, setOrdenacao] = useState('relevancia')
  const [marcasCadastradas, setMarcasCadastradas] = useState([])

  const mostrarControles = Boolean(filtro || mostrarBusca || mostrarOrdenacao) && !limite

  useEffect(() => {
    if (filtro !== 'marca') return
    let ativo = true
    api
      .getMarcas()
      .then((dados) => {
        if (ativo) setMarcasCadastradas(dados.map((m) => m.nome))
      })
      .catch(() => {})
    return () => {
      ativo = false
    }
  }, [filtro])

  // A marca vinda da URL (/loja?marca=Nike) só chega como valor inicial do
  // state; sem isso, navegar de uma marca pra outra pela home não trocava o
  // chip ativo, porque o componente não remonta.
  useEffect(() => {
    setMarca(marcaInicial)
  }, [marcaInicial])

  useEffect(() => {
    let ativo = true
    setCarregando(true)

    const filtros = {}
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
          if (apenasDestaque) dados = dados.filter((p) => p.destaque)
          setProdutos(dados)
          setUsandoMock(true)
        }
      })
      .finally(() => ativo && setCarregando(false))

    return () => {
      ativo = false
    }
  }, [apenasDestaque])

  // Marcas disponíveis pros chips — une o cadastro de marcas (pra já
  // aparecer assim que uma marca nova é registrada, mesmo sem produto
  // ainda) com o que realmente veio nos produtos (cobre marca antiga
  // que não esteja mais no cadastro).
  const marcasDisponiveis = useMemo(
    () =>
      [...new Set([...marcasCadastradas, ...produtos.map((p) => p.marca)])].sort((a, b) =>
        a.localeCompare(b, 'pt-BR'),
      ),
    [produtos, marcasCadastradas],
  )

  const visiveis = useMemo(() => {
    let lista = produtos

    if (filtro === 'marca' && marca) {
      lista = lista.filter((p) => p.marca === marca)
    }

    if (busca.trim()) {
      const termo = busca.trim().toLowerCase()
      lista = lista.filter(
        (p) => p.nome.toLowerCase().includes(termo) || p.marca.toLowerCase().includes(termo),
      )
    }

    lista = ordenar(lista, ordenacao)

    return limite ? lista.slice(0, limite) : lista
  }, [produtos, filtro, marca, busca, ordenacao, limite])

  const temFiltroAtivo = Boolean(marca || busca.trim())

  function limparFiltros() {
    setMarca('')
    setBusca('')
  }

  return (
    <section id="vitrine" className="vitrine">
      <div className="vitrine__header">
        <div>
          <p className="section-label">Vitrine</p>
          <h2 className="section-title">{titulo}</h2>
        </div>
      </div>

      {mostrarControles && (
        <div className="vitrine__controles">
          <div className="vitrine__linha-busca">
            {mostrarBusca && (
              <label className="vitrine__busca">
                <IconSearch aria-hidden="true" />
                <input
                  type="search"
                  placeholder="Buscar peça ou marca..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  aria-label="Buscar produto"
                  enterKeyHint="search"
                  autoComplete="off"
                />
                {busca && (
                  <button
                    type="button"
                    className="vitrine__busca-limpar"
                    onClick={() => setBusca('')}
                    aria-label="Limpar busca"
                  >
                    <IconClose aria-hidden="true" />
                  </button>
                )}
              </label>
            )}

            {mostrarOrdenacao && (
              <div className="vitrine__ordenacao">
                <select value={ordenacao} onChange={(e) => setOrdenacao(e.target.value)} aria-label="Ordenar produtos">
                  {ORDENACOES.map((o) => (
                    <option key={o.valor} value={o.valor}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <IconChevronDown aria-hidden="true" />
              </div>
            )}
          </div>

          {filtro === 'marca' && marcasDisponiveis.length > 0 && (
            <div className="vitrine__filtros-wrap">
              <div className="vitrine__filtros" role="group" aria-label="Filtrar por marca">
                <button
                  type="button"
                  className={`chip ${marca === '' ? 'chip--active' : ''}`}
                  onClick={() => setMarca('')}
                  aria-pressed={marca === ''}
                >
                  Todas
                </button>
                {marcasDisponiveis.map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`chip ${marca === m ? 'chip--active' : ''}`}
                    onClick={() => setMarca(m)}
                    aria-pressed={marca === m}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!carregando && (
            <div className="vitrine__resultado">
              <span aria-live="polite">
                {visiveis.length} {visiveis.length === 1 ? 'produto' : 'produtos'}
                {marca && ` · ${marca}`}
              </span>
              {temFiltroAtivo && (
                <button type="button" className="vitrine__limpar" onClick={limparFiltros}>
                  Limpar filtros
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {usandoMock && (
        <p className="vitrine__aviso">
          <IconAlert aria-hidden="true" />
          Não consegui falar com o servidor agora — estes são produtos de exemplo.
        </p>
      )}

      {carregando ? (
        <div className="vitrine__grid">
          {Array.from({ length: SKELETONS }, (_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : visiveis.length === 0 ? (
        <div className="vitrine__vazio">
          <IconBagEmpty className="vitrine__vazio-icon" aria-hidden="true" />
          <p className="vitrine__vazio-titulo">Nenhum produto encontrado</p>
          <p className="vitrine__vazio-texto">
            {temFiltroAtivo
              ? 'Tente outra marca ou mude os termos da busca.'
              : 'Em breve novas peças na vitrine.'}
          </p>
          {temFiltroAtivo && (
            <button type="button" className="btn btn--outline" onClick={limparFiltros}>
              Limpar filtros
            </button>
          )}
        </div>
      ) : (
        <div className="vitrine__grid">
          {visiveis.map((p, i) => (
            <ProductCard key={p.id} produto={p} prioridade={i < CARDS_PRIORITARIOS} />
          ))}
        </div>
      )}
    </section>
  )
}
