import { useSearchParams } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'

export default function Loja() {
  const [searchParams] = useSearchParams()
  const marcaInicial = searchParams.get('marca') || ''
  const apenasDestaque = searchParams.get('destaque') === '1'

  return (
    <div className="pagina-loja">
      <div className="catalogo__cabecalho">
        <h1 className="catalogo__titulo">
          Catálogo <span className="text-gold">completo</span>
        </h1>
        <div className="hero__divider" aria-hidden="true" />
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
