import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import RootLayout from './layouts/RootLayout'
import Home from './pages/Home'
import Loja from './pages/Loja'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import PagamentoRetorno from './pages/PagamentoRetorno'
import AdminRoute from './components/admin/AdminRoute'
import NotFound from './pages/NotFound'

// O painel admin é usado só pela loja, mas ia junto no mesmo bundle que
// todo cliente baixa — inclusive no 4G do celular. Em lazy() ele vira um
// arquivo à parte, carregado só quando alguém abre /admin.
const AdminLayout = lazy(() => import('./layouts/AdminLayout'))
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminProdutos = lazy(() => import('./pages/admin/AdminProdutos'))
const AdminProdutoForm = lazy(() => import('./pages/admin/AdminProdutoForm'))
const AdminMarcas = lazy(() => import('./pages/admin/AdminMarcas'))
const AdminPedidos = lazy(() => import('./pages/admin/AdminPedidos'))
const AdminPedidoDetail = lazy(() => import('./pages/admin/AdminPedidoDetail'))
const AdminEnvios = lazy(() => import('./pages/admin/AdminEnvios'))
const AdminPromocoes = lazy(() => import('./pages/admin/AdminPromocoes'))
const AdminPromocaoForm = lazy(() => import('./pages/admin/AdminPromocaoForm'))

function CarregandoPagina() {
  return (
    <div className="pagina-status">
      <div className="spinner" aria-hidden="true" />
      <p>Carregando...</p>
    </div>
  )
}

export default function App() {
  return (
    <Suspense fallback={<CarregandoPagina />}>
      <ScrollToTop />
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/loja" element={<Loja />} />
          <Route path="/produto/:id" element={<ProductDetail />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pagamento/:resultado" element={<PagamentoRetorno />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route path="/admin/entrar" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="produtos" element={<AdminProdutos />} />
          <Route path="produtos/novo" element={<AdminProdutoForm />} />
          <Route path="produtos/:id/editar" element={<AdminProdutoForm />} />
          <Route path="marcas" element={<AdminMarcas />} />
          <Route path="pedidos" element={<AdminPedidos />} />
          <Route path="pedidos/:id" element={<AdminPedidoDetail />} />
          <Route path="envios" element={<AdminEnvios />} />
          <Route path="promocoes" element={<AdminPromocoes />} />
          <Route path="promocoes/nova" element={<AdminPromocaoForm />} />
          <Route path="promocoes/:id/editar" element={<AdminPromocaoForm />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
