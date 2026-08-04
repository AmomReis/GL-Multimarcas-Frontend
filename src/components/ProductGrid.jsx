import { useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api'
import { products as mockProducts } from '../data/products'
import ProductCard from './ProductCard'
import { IconSearch, IconChevronDown } from './icons'

const ORDENACOES = [
  { valor: 'relevancia', label: 'Relevância' },
  { valor: 'menor-preco', label: 'Menor preço' },
  { valor: 'maior-preco', label: 'Maior preço' },
  { valor: 'nome', label: 'Nome (A-Z)' },
]

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

  const mostrarControles = Boolean(filtro || mostrarBusca || mostrarOrdenacao) && !limite

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

  // Marcas disponíveis pros chips — calculadas a partir do que realmente veio
  // da API, então sempre reflete o catálogo real (não uma lista fixa).
  const marcasDisponiveis = useMemo(
    () => [...new Set(produtos.map((p) => p.marca))].sort((a, b) => a.localeCompare(b, 'pt-BR')),
    [produtos],
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
          {mostrarBusca && (
            <label className="vitrine__busca">
              <IconSearch aria-hidden="true" />
              <input
                type="search"
                placeholder="Buscar camisa ou marca..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                aria-label="Buscar produto"
              />
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

          {filtro === 'marca' && marcasDisponiveis.length > 0 && (
            <div className="vitrine__filtros" role="group" aria-label="Filtrar por marca">
              <button
                type="button"
                className={`chip ${marca === '' ? 'chip--active' : ''}`}
                onClick={() => setMarca('')}
              >
                Todas
              </button>
              {marcasDisponiveis.map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`chip ${marca === m ? 'chip--active' : ''}`}
                  onClick={() => setMarca(m)}
                >
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {usandoMock && (
        <p className="vitrine__status">
          Não consegui falar com o backend agora — mostrando produtos de exemplo.
        </p>
      )}

      {carregando ? (
        <p className="vitrine__status">Carregando produtos...</p>
      ) : visiveis.length === 0 ? (
        <p className="vitrine__status">Nenhum produto encontrado.</p>
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
