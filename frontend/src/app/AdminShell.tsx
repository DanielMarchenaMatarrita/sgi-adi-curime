import { useState } from 'react'
import { NavLink, Outlet } from 'react-router'
import { useSession } from '../features/session/session-context'
import { Icon } from '../shared/ui/Icon'

export function AdminShell() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { state, isAdmin, logout } = useSession()
  const user = state.status === 'authenticated' ? state.user : null

  return (
    <div className="admin-layout">
      <button
        aria-controls="admin-sidebar"
        aria-expanded={menuOpen}
        className="mobile-menu"
        onClick={() => setMenuOpen((open) => !open)}
        type="button"
      >
        <Icon name={menuOpen ? 'x' : 'menu'} />
        <span>{menuOpen ? 'Cerrar menú' : 'Abrir menú'}</span>
      </button>
      <aside className={`admin-sidebar${menuOpen ? ' admin-sidebar--open' : ''}`} id="admin-sidebar">
        <div className="admin-sidebar__brand">
          <strong>SGI-Curime</strong>
          <span>Gestión Administrativa</span>
        </div>
        <nav aria-label="Navegación administrativa">
          <NavLink to="/app" end onClick={() => setMenuOpen(false)}>
            <Icon name="dashboard" /> Inicio
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" onClick={() => setMenuOpen(false)}>
              <Icon name="shield" /> Administrativo
            </NavLink>
          )}
          <span className="admin-sidebar__pending"><Icon name="people" /> Afiliados <small>Próximamente</small></span>
        </nav>
        <button className="admin-sidebar__logout" type="button" onClick={logout}>
          <Icon name="logout" /> Cerrar sesión
        </button>
      </aside>
      <div className="admin-workspace">
        <header className="admin-topbar">
          <div>
            <span className="eyebrow">Sesión activa</span>
            <strong>{user?.fullName}</strong>
          </div>
          <span className="user-mark" aria-hidden="true"><Icon name="user" /></span>
        </header>
        <main className="admin-content"><Outlet /></main>
      </div>
    </div>
  )
}
