import { Routes, Route } from 'react-router-dom'
import RootLayout from './layouts/RootLayout'
import AdminLayout from './layouts/AdminLayout'
import Home from './pages/Home'
import Loja from './pages/Loja'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import PagamentoRetorno from './pages/PagamentoRetorno'
import Login from './pages/Login'
import Register from './pages/Register'
import EsqueciSenha from './pages/EsqueciSenha'
import RedefinirSenha from './pages/RedefinirSenha'
import Account from './pages/Account'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/admin/AdminRoute'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProdutos from './pages/admin/AdminProdutos'
import AdminProdutoForm from './pages/admin/AdminProdutoForm'
import AdminPedidos from './pages/admin/AdminPedidos'
import AdminPedidoDetail from './pages/admin/AdminPedidoDetail'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/loja" element={<Loja />} />
        <Route path="/produto/:id" element={<ProductDetail />} />
        <Route path="/carrinho" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/pagamento/:resultado" element={<PagamentoRetorno />} />
        <Route path="/entrar" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/esqueci-senha" element={<EsqueciSenha />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />
        <Route path="/conta" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="produtos" element={<AdminProdutos />} />
        <Route path="produtos/novo" element={<AdminProdutoForm />} />
        <Route path="produtos/:id/editar" element={<AdminProdutoForm />} />
        <Route path="pedidos" element={<AdminPedidos />} />
        <Route path="pedidos/:id" element={<AdminPedidoDetail />} />
      </Route>
    </Routes>
  )
}