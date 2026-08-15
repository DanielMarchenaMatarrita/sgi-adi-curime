import { createContext, useContext } from 'react'
import type { apiRequest } from '../../shared/api/client'
import type { CurrentUser } from '../../shared/api/contracts'

export type SessionState =
  | { status: 'restoring' }
  | { status: 'anonymous' }
  | { status: 'authenticated'; token: string; user: CurrentUser }
  | { status: 'restore-error' }

export interface SessionContextValue {
  state: SessionState
  isAdmin: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  retryRestore: () => void
  authenticatedRequest: typeof apiRequest
}

export const SessionContext = createContext<SessionContextValue | null>(null)

export function useSession(): SessionContextValue {
  const value = useContext(SessionContext)
  if (!value) {
    throw new Error('useSession debe utilizarse dentro de SessionProvider.')
  }
  return value
}
