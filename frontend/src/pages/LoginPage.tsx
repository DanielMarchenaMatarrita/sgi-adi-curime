import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useSession } from '../features/session/session-context'
import { Icon } from '../shared/ui/Icon'

function safeDestination(value: unknown): string {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')
    ? value
    : '/app'
}

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const { login } = useSession()
  const location = useLocation()
  const navigate = useNavigate()

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    setPending(true)
    setError('')
    try {
      await login(email, password)
      const from = safeDestination((location.state as { from?: unknown } | null)?.from)
      navigate(from, { replace: true })
    } catch {
      setPassword('')
      setError('El correo o la contraseña no son correctos, o la cuenta no está disponible.')
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <header className="login-card__header">
          <span className="login-card__mark"><Icon name="shield" size={32} /></span>
          <h1 id="login-title">SGI-Curime</h1>
          <p>Gestión Administrativa</p>
        </header>
        <div className="login-card__body">
          {error && <div className="feedback feedback--error" role="alert">{error}</div>}
          <form onSubmit={submit}>
            <label htmlFor="email">Correo electrónico</label>
            <div className="input-with-icon"><Icon name="user" size={20} /><input id="email" name="email" autoComplete="email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nombre@correo.com" /></div>
            <label htmlFor="password">Contraseña</label>
            <div className="input-with-icon"><Icon name="lock" size={20} /><input id="password" name="password" autoComplete="current-password" required type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Ingrese su contraseña" /></div>
            <button className="button button--primary login-card__submit" disabled={pending} type="submit">{pending ? 'Validando acceso…' : 'Iniciar sesión'}</button>
          </form>
          <p className="login-card__help">¿Aún no tienes acceso? <Link to="/solicitar-cuenta">Solicita una cuenta</Link>.</p>
        </div>
      </section>
    </main>
  )
}
