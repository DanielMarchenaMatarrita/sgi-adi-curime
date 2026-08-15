import { Navigate, Outlet, useLocation } from 'react-router'
import { useSession } from '../features/session/session-context'
import { StatusPanel } from '../shared/ui/StatusPanel'

function SessionGate() {
  const { state, retryRestore, logout } = useSession()

  if (state.status === 'restoring') {
    return (
      <main className="centered-page" aria-live="polite">
        <StatusPanel title="Validando sesión" message="Estamos comprobando tu acceso de forma segura." />
      </main>
    )
  }

  if (state.status === 'restore-error') {
    return (
      <main className="centered-page">
        <StatusPanel
          title="No pudimos validar la sesión"
          message="El servidor no está disponible en este momento. Puedes intentarlo nuevamente sin perder la sesión guardada."
          action={
            <div className="button-row">
              <button className="button button--primary" type="button" onClick={retryRestore}>Reintentar</button>
              <button className="button button--outline" type="button" onClick={logout}>Cerrar sesión</button>
            </div>
          }
        />
      </main>
    )
  }

  return <Outlet />
}

function GuestOnlyRoute() {
  const { state } = useSession()
  return state.status === 'authenticated' ? <Navigate to="/app" replace /> : <Outlet />
}

function AuthenticatedRoute() {
  const { state } = useSession()
  const location = useLocation()
  return state.status === 'authenticated' ? (
    <Outlet />
  ) : (
    <Navigate to="/iniciar-sesion" replace state={{ from: location.pathname }} />
  )
}

function AdministratorRoute() {
  const { isAdmin } = useSession()
  return isAdmin ? <Outlet /> : <Navigate to="/403" replace />
}

export { AdministratorRoute, AuthenticatedRoute, GuestOnlyRoute, SessionGate }
