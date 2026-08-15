import { BrowserRouter, Route, Routes } from 'react-router'
import { AdminShell } from './app/AdminShell'
import { PublicLayout } from './app/PublicLayout'
import { AdministratorRoute, AuthenticatedRoute, GuestOnlyRoute, SessionGate } from './app/route-guards'
import { SessionProvider } from './features/session/SessionProvider'
import { AccountRequestPage, ActivationPage, AdministratorPage, AuthenticatedHomePage, ForbiddenPage, NotFoundPage } from './pages/FoundationPages'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'

export default function App() {
  return (
    <BrowserRouter>
      <SessionProvider>
        <Routes>
          <Route element={<SessionGate />}>
            <Route element={<PublicLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="solicitar-cuenta" element={<AccountRequestPage />} />
              <Route path="activar-cuenta" element={<ActivationPage />} />
            </Route>
            <Route element={<GuestOnlyRoute />}>
              <Route path="iniciar-sesion" element={<LoginPage />} />
            </Route>
            <Route element={<AuthenticatedRoute />}>
              <Route element={<AdminShell />}>
                <Route path="app" element={<AuthenticatedHomePage />} />
                <Route element={<AdministratorRoute />}>
                  <Route path="admin" element={<AdministratorPage />} />
                </Route>
              </Route>
              <Route path="403" element={<ForbiddenPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </SessionProvider>
    </BrowserRouter>
  )
}
