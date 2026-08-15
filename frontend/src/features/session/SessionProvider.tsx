import { useEffect, useState, type ReactNode } from 'react'
import { ApiError, apiRequest } from '../../shared/api/client'
import type { CurrentUser, LoginResponse } from '../../shared/api/contracts'
import { SessionContext, type SessionState } from './session-context'
import { clearToken, readToken, storeToken } from './token-storage'

const ADMIN_ROLE = 'Administrador'

function isCurrentUser(value: unknown): value is CurrentUser {
  if (!value || typeof value !== 'object') {
    return false
  }
  const user = value as Partial<CurrentUser>
  return (
    typeof user.id === 'number' &&
    typeof user.fullName === 'string' &&
    typeof user.email === 'string' &&
    typeof user.status === 'string' &&
    Boolean(user.role) &&
    typeof user.role?.name === 'string'
  )
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>({ status: 'restoring' })
  const [restoreAttempt, setRestoreAttempt] = useState(0)

  useEffect(() => {
    const token = readToken()
    if (!token) {
      setState({ status: 'anonymous' })
      return
    }

    const controller = new AbortController()
    setState({ status: 'restoring' })
    apiRequest<CurrentUser>('/auth/me', { token, signal: controller.signal })
      .then((user) => {
        if (!isCurrentUser(user)) {
          throw new Error('Respuesta de sesión inválida.')
        }
        setState({ status: 'authenticated', token, user })
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }
        if (error instanceof ApiError && error.status === 401) {
          clearToken()
          setState({ status: 'anonymous' })
          return
        }
        setState({ status: 'restore-error' })
      })

    return () => controller.abort()
  }, [restoreAttempt])

  function invalidateSession(): void {
    clearToken()
    setState({ status: 'anonymous' })
  }

  async function login(email: string, password: string): Promise<void> {
    const response = await apiRequest<LoginResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    if (
      !response ||
      typeof response.accessToken !== 'string' ||
      !response.accessToken ||
      !isCurrentUser(response.user)
    ) {
      throw new Error('Respuesta de autenticación inválida.')
    }

    storeToken(response.accessToken)
    setState({
      status: 'authenticated',
      token: response.accessToken,
      user: response.user,
    })
  }

  function authenticatedRequest<T>(
    path: string,
    options: Parameters<typeof apiRequest<T>>[1] = {},
  ): Promise<T> {
    if (state.status !== 'authenticated') {
      return Promise.reject(new Error('No existe una sesión autenticada.'))
    }
    return apiRequest<T>(path, {
      ...options,
      token: state.token,
      onUnauthorized: invalidateSession,
    })
  }

  return (
    <SessionContext.Provider
      value={{
        state,
        isAdmin:
          state.status === 'authenticated' && state.user.role.name === ADMIN_ROLE,
        login,
        logout: invalidateSession,
        retryRestore: () => setRestoreAttempt((attempt) => attempt + 1),
        authenticatedRequest,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}
