import { Outlet, useMatch } from 'react-router-dom'
import TopBar from '../components/TopBar'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BottomNav from '../components/BottomNav'

export default function RootLayout() {
  // Na página do produto o rodapé fixo do celular vira a barra de compra
  // (preço + "adicionar à sacola"), então a bottom nav sai de cena — duas
  // barras empilhadas comiam metade da tela em aparelho pequeno.
  const emProduto = Boolean(useMatch('/produto/:id'))

  return (
    <div className={`app-shell ${emProduto ? 'app-shell--produto' : ''}`}>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>

      <TopBar />
      <Header />

      <main id="conteudo">
        <Outlet />
      </main>

      <Footer />
      {!emProduto && <BottomNav />}
    </div>
  )
}
