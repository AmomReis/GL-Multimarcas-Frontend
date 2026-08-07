import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
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

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [abertaMobile, setAbertaMobile] = useState(false)

  function handleSair() {
    logout()
    navigate('/')
  }

  const iniciais = (user?.nome || 'A')
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join('')

  return (
    <div className="admin-shell">
      {abertaMobile && <div className="admin-overlay" onClick={() => setAbertaMobile(false)} />}

      <aside className={`admin-sidebar ${abertaMobile ? 'is-open' : ''}`}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
            <button
              type="button"
              className="admin-topbar__toggle"
              onClick={() => setAbertaMobile((v) => !v)}
              aria-label="Alternar menu"
            >
              <IconMenu />
            </button>
            <span className="admin-topbar__title">Painel Admin</span>
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