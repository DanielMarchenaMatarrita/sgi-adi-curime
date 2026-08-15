import { Link, Outlet } from 'react-router'
import { Icon } from '../shared/ui/Icon'

export function PublicLayout() {
  return (
    <div className="public-layout">
      <header className="public-header">
        <Link className="brand" to="/" aria-label="SGI-Curime, inicio">
          <Icon name="building" />
          <span>SGI-Curime</span>
        </Link>
        <nav className="public-nav" aria-label="Navegación pública">
          <Link aria-current="page" to="/">Inicio</Link>
          <span title="Sección en preparación">Información ADI</span>
          <span title="Sección en preparación">Actividades</span>
          <span title="Sección en preparación">Servicios</span>
        </nav>
        <Link className="button button--primary public-login" to="/iniciar-sesion">Iniciar sesión</Link>
      </header>
      <Outlet />
      <footer className="public-footer">
        <span className="brand brand--small"><Icon name="building" size={20} /> SGI-Curime</span>
        <p>Asociación de Desarrollo Integral de Curime</p>
        <span>Portal comunitario</span>
      </footer>
    </div>
  )
}
