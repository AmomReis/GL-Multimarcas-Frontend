import { NavLink } from 'react-router-dom'
import { IconHome, IconHanger, IconBag } from './icons'
import { useCart } from '../context/CartContext'

export default function BottomNav() {
  const { totalItens } = useCart()

  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      <div className="bottom-nav__bar">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}
        >
          <IconHome className="bottom-nav__icon" />
          <span className="bottom-nav__label">Início</span>
        </NavLink>

        <NavLink
          to="/loja"
          className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}
        >
          <IconHanger className="bottom-nav__icon" />
          <span className="bottom-nav__label">Loja</span>
        </NavLink>

        <NavLink
          to="/carrinho"
          className={({ isActive }) => `bottom-nav__item ${isActive ? 'is-active' : ''}`}
          aria-label={`Sacola${totalItens > 0 ? `, ${totalItens} ${totalItens === 1 ? 'item' : 'itens'}` : ' vazia'}`}
        >
          <span className="bottom-nav__icon-wrap" data-cart-target="primary">
            <IconBag className="bottom-nav__icon" />
            {totalItens > 0 && <span className="bottom-nav__badge">{totalItens}</span>}
          </span>
          <span className="bottom-nav__label">Sacola</span>
        </NavLink>
      </div>
    </nav>
  )
}
