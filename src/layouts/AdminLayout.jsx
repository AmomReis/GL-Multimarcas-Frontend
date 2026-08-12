import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.png'
import { IconGrid, IconBox, IconClipboard, IconTruck, IconTag, IconImage, IconLogout, IconMenu } from '../components/admin/AdminIcons'
import '../styles/Admin.css'

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: IconGrid, end: true },
  { to: '/admin/produtos', label: 'Produtos', icon: IconBox },
  { to: '/admin/marcas', label: 'Marcas', icon: IconTag },
  { to: '/admin/pedidos', label: 'Pedidos', icon: IconClipboard },
  { to: '/admin/envios', label: 'Envios', icon: IconTruck },
  { to: '/admin/promocoes', label: 'Promoções', icon: IconImage },
]

// Precisa bater com o @media (max-width: 900px) do Admin.css, onde a
// sidebar deixa de ser fixa na tela e vira gaveta.
const CONSULTA_GAVETA = '(max-width: 900px)'

// Com a sidebar escondida no celular, "Painel Admin" fixo na barra não diz
// onde a pessoa está. O título passa a seguir a rota — o item mais
// específico que casa com o caminho atual.
function tituloDaRota(pathname) {
  const item = [...NAV_ITEMS]
    .sort((a, b) => b.to.length - a.to.length)
    .find(({ to, end }) => (end ? pathname === to : pathname.startsWith(to)))
  return item?.label || 'Painel Admin'
}

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [abertaMobile, setAbertaMobile] = useState(false)
  const [emGaveta, setEmGaveta] = useState(() => window.matchMedia(CONSULTA_GAVETA).matches)
  const botaoMenuRef = useRef(null)
  const sidebarRef = useRef(null)

  // O `inert` da gaveta fechada só vale no layout de celular — acima de
  // 900px a sidebar está visível e precisa continuar navegável por Tab, e
  // atributo de DOM não entende media query.
  useEffect(() => {
    const mq = window.matchMedia(CONSULTA_GAVETA)
    const onChange = (e) => setEmGaveta(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  function handleSair() {
    logout()
    navigate('/')
  }

  // Fecha a gaveta ao trocar de página — sem isso ela continuava aberta por
  // cima do conteúdo novo depois de tocar num item do menu em telas onde o
  // clique não chega a disparar o onClick do NavLink (ex: navegação pelo
  // teclado ou pelo botão voltar).
  useEffect(() => {
    setAbertaMobile(false)
  }, [location.pathname])

  // Gaveta aberta: trava a rolagem do conteúdo atrás, fecha no Esc e devolve
  // o foco pro botão que abriu.
  useEffect(() => {
    if (!abertaMobile) return

    const overflowAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKeyDown(e) {
      if (e.key === 'Escape') {
        setAbertaMobile(false)
        botaoMenuRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)

    sidebarRef.current?.querySelector('a, button')?.focus()

    return () => {
      document.body.style.overflow = overflowAnterior
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [abertaMobile])

  const iniciais = (user?.nome || 'A')
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join('')

  return (
    <div className="admin-shell">
      {abertaMobile && (
        <div className="admin-overlay" onClick={() => setAbertaMobile(false)} aria-hidden="true" />
      )}

      <aside
        id="admin-menu"
        ref={sidebarRef}
        className={`admin-sidebar ${abertaMobile ? 'is-open' : ''}`}
        // A gaveta fechada só sai da tela por transform: sem inert ela
        // continuaria recebendo Tab por trás do conteúdo no celular.
        {...(emGaveta && !abertaMobile ? { inert: '' } : {})}
      >
        <div className="admin-sidebar__brand">
          <img src={logo} alt="GL Multimarcas" />
          <span>Painel Admin</span>
        </div>

        <nav className="admin-sidebar__nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setAbertaMobile(false)}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'is-active' : ''}`}
            >
              <Icon />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <button type="button" className="admin-btn-sair" onClick={handleSair}>
            <IconLogout />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar__esquerda">
            <button
              ref={botaoMenuRef}
              type="button"
              className="admin-topbar__toggle"
              onClick={() => setAbertaMobile((v) => !v)}
              aria-label={abertaMobile ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={abertaMobile}
              aria-controls="admin-menu"
            >
              <IconMenu />
            </button>
            <span className="admin-topbar__title">{tituloDaRota(location.pathname)}</span>
          </div>

          <div className="admin-topbar__user">
            <span>{user?.nome}</span>
            <div className="admin-topbar__avatar">{iniciais}</div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
