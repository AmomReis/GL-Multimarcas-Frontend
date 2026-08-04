import { Outlet } from 'react-router-dom'
import TopBar from '../components/TopBar'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BottomNav from '../components/BottomNav'

export default function RootLayout() {
  return (
    <>
      <TopBar />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </>
  )
}
