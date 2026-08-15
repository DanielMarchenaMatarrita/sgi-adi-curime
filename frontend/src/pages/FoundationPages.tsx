import { Link } from 'react-router'
import { useSession } from '../features/session/session-context'
import { StatusPanel } from '../shared/ui/StatusPanel'

export function AccountRequestPage() {
  return <main className="centered-page"><StatusPanel title="Solicitud de cuenta" message="El formulario de solicitud se incorporará en la siguiente entrega. La ruta ya está preparada para recibir este proceso." action={<Link className="button button--outline" to="/">Volver al portal</Link>} /></main>
}

export function ActivationPage() {
  return <main className="centered-page"><StatusPanel title="Activación de cuenta" message="Abre el enlace de activación enviado por la ADI. La experiencia completa se habilitará junto con el flujo de aprobación." action={<Link className="button button--outline" to="/iniciar-sesion">Ir a iniciar sesión</Link>} /></main>
}

export function AuthenticatedHomePage() {
  const { state, isAdmin } = useSession()
  const user = state.status === 'authenticated' ? state.user : null
  return (
    <section className="workspace-page">
      <span className="eyebrow">Asociación de Desarrollo Integral</span>
      <h1>Bienvenido, {user?.fullName}</h1>
      <p className="workspace-page__lead">Tu sesión fue validada directamente con SGI-Curime.</p>
      <div className="foundation-grid">
        <article><strong>Acceso seguro</strong><p>La identidad y el rol se verifican con el servidor en cada sesión.</p></article>
        <article><strong>Rol actual</strong><p>{user?.role.name}</p></article>
        <article><strong>Siguiente etapa</strong><p>{isAdmin ? 'Solicitudes y gestión de afiliados.' : 'Servicios comunitarios y perfil personal.'}</p></article>
      </div>
    </section>
  )
}

export function AdministratorPage() {
  return (
    <section className="workspace-page">
      <span className="eyebrow">Panel administrativo</span>
      <h1>Base de gestión preparada</h1>
      <p className="workspace-page__lead">Este espacio mostrará únicamente indicadores respaldados por los módulos implementados.</p>
      <div className="foundation-grid">
        <article><strong>Afiliación</strong><p>Próxima entrega: solicitudes, aprobación y consulta de afiliados.</p></article>
        <article><strong>Usuarios</strong><p>Se integrará con los roles actuales y el flujo de activación.</p></article>
        <article><strong>Dashboard</strong><p>Se construirá después, sin cifras ni actividades demostrativas.</p></article>
      </div>
    </section>
  )
}

export function ForbiddenPage() {
  return <main className="centered-page"><StatusPanel title="Acceso restringido" message="Tu rol actual no permite ingresar a esta sección." action={<Link className="button button--outline" to="/app">Volver al inicio</Link>} /></main>
}

export function NotFoundPage() {
  return <main className="centered-page"><StatusPanel title="Página no encontrada" message="La dirección solicitada no corresponde a una sección disponible." action={<Link className="button button--primary" to="/">Ir al portal</Link>} /></main>
}
