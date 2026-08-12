import { useSearchParams } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'

export default function Loja() {
  const [searchParams] = useSearchParams()
  const marcaInicial = searchParams.get('marca') || ''
  const apenasDestaque = searchParams.get('destaque') === '1'

  return (
    <div className="pagina-loja">
      <div className="catalogo__cabecalho">
        <p className="section-label">{apenasDestaque ? 'Seleção da semana' : 'Curadoria GL'}</p>
        <h1 className="catalogo__titulo">
          {apenasDestaque ? (
            <>Ofertas da <span className="text-gold-shine">semana</span></>
          ) : (
            <>Catálogo <span className="text-gold-shine">completo</span></>
          )}
        </h1>
        <div className="hero__divider" aria-hidden="true" />
        <p className="catalogo__subtitulo">
          {apenasDestaque
            ? 'As peças em destaque da curadoria, enquanto durar o estoque.'
            : 'Filtre por marca, busque pelo nome e monte sua sacola.'}
        </p>
      </div>

      <ProductGrid
        titulo={apenasDestaque ? 'Ofertas da semana' : 'Todos os produtos'}
        apenasDestaque={apenasDestaque}
        filtro="marca"
        marcaInicial={marcaInicial}
        mostrarBusca
        mostrarOrdenacao
      />
    </div>
  )
}
