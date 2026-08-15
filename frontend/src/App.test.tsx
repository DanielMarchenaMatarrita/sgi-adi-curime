import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

const adminUser = {
  id: 1,
  fullName: 'Ana Administradora',
  email: 'ana@curime.test',
  status: 'ACTIVE',
  role: { id: 1, name: 'Administrador', description: null, isActive: true },
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('SGI-Curime application', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  it('renders the Spanish public portal and an accessible login route', async () => {
    render(<App />)
    expect(await screen.findByRole('heading', { name: /tu portal comunitario/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /iniciar sesión/i })).toHaveAttribute('href', '/iniciar-sesion')
  })

  it('logs in once and navigates to the authenticated destination', async () => {
    const fetchMock = vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ accessToken: 'fake-token', user: adminUser }),
    )
    window.history.pushState(null, '', '/iniciar-sesion')
    const user = userEvent.setup()
    render(<App />)

    await user.type(await screen.findByLabelText('Correo electrónico'), 'ana@curime.test')
    await user.type(screen.getByLabelText('Contraseña'), 'Segura1234')
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(await screen.findByRole('heading', { name: /bienvenido, ana administradora/i })).toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledOnce()
    expect(sessionStorage.length).toBe(1)
    expect(JSON.stringify(sessionStorage)).not.toContain('Segura1234')
  })

  it('shows a generic rejected-login message and clears the password', async () => {
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ message: 'Invalid credentials' }, 401))
    window.history.pushState(null, '', '/iniciar-sesion')
    const user = userEvent.setup()
    render(<App />)

    await user.type(await screen.findByLabelText('Correo electrónico'), 'ana@curime.test')
    const password = screen.getByLabelText('Contraseña')
    await user.type(password, 'Incorrecta123')
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/correo o la contraseña no son correctos/i)
    expect(password).toHaveValue('')
  })

  it('prevents duplicate login requests while submission is pending', async () => {
    let resolveLogin: ((response: Response) => void) | undefined
    vi.mocked(fetch).mockReturnValueOnce(
      new Promise<Response>((resolve) => {
        resolveLogin = resolve
      }),
    )
    window.history.pushState(null, '', '/iniciar-sesion')
    const user = userEvent.setup()
    render(<App />)

    await user.type(await screen.findByLabelText('Correo electrónico'), 'ana@curime.test')
    await user.type(screen.getByLabelText('Contraseña'), 'Segura1234')
    const submit = screen.getByRole('button', { name: 'Iniciar sesión' })
    await user.click(submit)
    expect(screen.getByRole('button', { name: /validando acceso/i })).toBeDisabled()
    await user.click(screen.getByRole('button', { name: /validando acceso/i }))
    expect(fetch).toHaveBeenCalledOnce()

    resolveLogin?.(jsonResponse({ accessToken: 'fake-token', user: adminUser }))
    expect(await screen.findByRole('heading', { name: /bienvenido, ana administradora/i })).toBeInTheDocument()
  })

  it('restores a persisted session through auth/me before showing protected content', async () => {
    sessionStorage.setItem('sgi-curime.access-token', 'fake-token')
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(adminUser))
    window.history.pushState(null, '', '/admin')
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Validando sesión' })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: 'Base de gestión preparada' })).toBeInTheDocument()
  })

  it('keeps a transiently failed token and retries session restoration', async () => {
    sessionStorage.setItem('sgi-curime.access-token', 'fake-token')
    vi.mocked(fetch)
      .mockRejectedValueOnce(new TypeError('offline'))
      .mockResolvedValueOnce(jsonResponse(adminUser))
    window.history.pushState(null, '', '/app')
    const user = userEvent.setup()
    render(<App />)

    expect(await screen.findByRole('heading', { name: 'No pudimos validar la sesión' })).toBeInTheDocument()
    expect(sessionStorage.getItem('sgi-curime.access-token')).toBe('fake-token')
    await user.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(await screen.findByRole('heading', { name: /bienvenido, ana administradora/i })).toBeInTheDocument()
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it('clears an unauthorized persisted session and redirects protected navigation', async () => {
    sessionStorage.setItem('sgi-curime.access-token', 'expired-token')
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse({ message: 'Unauthorized' }, 401))
    window.history.pushState(null, '', '/app')
    render(<App />)

    expect(await screen.findByRole('heading', { name: 'SGI-Curime' })).toBeInTheDocument()
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
    expect(sessionStorage.length).toBe(0)
  })

  it('denies the administrator route to another validated role', async () => {
    sessionStorage.setItem('sgi-curime.access-token', 'neighbor-token')
    vi.mocked(fetch).mockResolvedValueOnce(
      jsonResponse({ ...adminUser, role: { ...adminUser.role, id: 4, name: 'Vecino/Afiliado' } }),
    )
    window.history.pushState(null, '', '/admin')
    render(<App />)

    expect(await screen.findByRole('heading', { name: 'Acceso restringido' })).toBeInTheDocument()
    expect(screen.queryByText('Base de gestión preparada')).not.toBeInTheDocument()
  })

  it('provides keyboard-operable mobile navigation and a local logout action', async () => {
    sessionStorage.setItem('sgi-curime.access-token', 'fake-token')
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(adminUser))
    window.history.pushState(null, '', '/app')
    const user = userEvent.setup()
    render(<App />)

    const menu = await screen.findByRole('button', { name: /abrir menú/i })
    menu.focus()
    await user.keyboard('{Enter}')
    expect(menu).toHaveAttribute('aria-expanded', 'true')

    await user.click(screen.getByRole('button', { name: /cerrar sesión/i }))
    await waitFor(() => expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument())
    expect(sessionStorage.length).toBe(0)
  })

  it('offers a keyboard-accessible route home for an unknown URL', async () => {
    window.history.pushState(null, '', '/ruta-inexistente')
    render(<App />)
    expect(await screen.findByRole('heading', { name: 'Página no encontrada' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ir al portal' })).toHaveAttribute('href', '/')
  })
})
