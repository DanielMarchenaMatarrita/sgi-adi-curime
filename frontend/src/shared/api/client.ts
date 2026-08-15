import { getApiUrl } from '../config/environment'
import type { ApiErrorBody } from './contracts'

export type ApiFailureKind = 'http' | 'network'

export class ApiError extends Error {
  readonly kind: ApiFailureKind
  readonly status?: number
  readonly messages: string[]

  constructor(kind: ApiFailureKind, messages: string[], status?: number) {
    super(messages[0])
    this.name = 'ApiError'
    this.kind = kind
    this.status = status
    this.messages = messages
  }
}

interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
  token?: string
  onUnauthorized?: () => void
}

const GENERIC_ERROR = 'No fue posible completar la solicitud.'

function safeMessages(value: unknown): string[] {
  if (!value || typeof value !== 'object') {
    return [GENERIC_ERROR]
  }

  const message = (value as ApiErrorBody).message
  if (typeof message === 'string' && message.trim()) {
    return [message]
  }
  if (Array.isArray(message)) {
    const messages = message.filter(
      (entry): entry is string => typeof entry === 'string' && Boolean(entry.trim()),
    )
    if (messages.length > 0) {
      return messages
    }
  }
  return [GENERIC_ERROR]
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { body, token, onUnauthorized, headers: suppliedHeaders, ...init } = options
  const headers = new Headers(suppliedHeaders)

  if (body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  let response: Response
  try {
    response = await fetch(new URL(path.replace(/^\//, ''), getApiUrl()), {
      ...init,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error
    }
    throw new ApiError('network', [
      'No se pudo conectar con el servidor. Verifique su conexión e inténtelo de nuevo.',
    ])
  }

  const text = await response.text()
  if (!response.ok) {
    if (response.status === 401 && token) {
      onUnauthorized?.()
    }

    let payload: unknown
    try {
      payload = text ? JSON.parse(text) : undefined
    } catch {
      payload = undefined
    }
    throw new ApiError('http', safeMessages(payload), response.status)
  }

  if (!text) {
    return undefined as T
  }

  return JSON.parse(text) as T
}
