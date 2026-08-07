import { Routes, Route } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop'
import RootLayout from './layouts/RootLayout'
import AdminLayout from './layouts/AdminLayout'
import Home from './pages/Home'
import Loja from './pages/Loja'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import PagamentoRetorno from './pages/PagamentoRetorno'
import AdminRoute from './components/admin/AdminRoute'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProdutos from './pages/admin/AdminProdutos'
import AdminProdutoForm from './pages/admin/AdminProdutoForm'
import AdminMarcas from './pages/admin/AdminMarcas'
import AdminPedidos from './pages/admin/AdminPedidos'
import AdminPedidoDetail from './pages/admin/AdminPedidoDetail'
import AdminEnvios from './pages/admin/AdminEnvios'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <>
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
        </Route>
      </Routes>
    </>
  )
}
