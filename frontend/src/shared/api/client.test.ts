import { describe, expect, it, vi } from 'vitest'
import { ApiError, apiRequest } from './client'

describe('apiRequest', () => {
  it('serializes JSON and attaches a supplied bearer token', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      apiRequest<{ ok: boolean }>('/resource', {
        method: 'POST',
        body: { name: 'Curime' },
        token: 'fake-token',
      }),
    ).resolves.toEqual({ ok: true })

    const [url, init] = fetchMock.mock.calls[0] as [URL, RequestInit]
    const headers = init.headers as Headers
    expect(url.toString()).toBe('http://localhost:3000/resource')
    expect(init.body).toBe('{"name":"Curime"}')
    expect(headers.get('Content-Type')).toBe('application/json')
    expect(headers.get('Authorization')).toBe('Bearer fake-token')
  })

  it('does not attach authorization to public requests and supports empty success', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(apiRequest('/public')).resolves.toBeUndefined()
    const headers = fetchMock.mock.calls[0][1].headers as Headers
    expect(headers.has('Authorization')).toBe(false)
  })

  it('preserves safe validation messages and status', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: ['Correo inválido', 'Contraseña requerida'] }), {
          status: 400,
        }),
      ),
    )

    await expect(apiRequest('/auth/login')).rejects.toMatchObject({
      kind: 'http',
      status: 400,
      messages: ['Correo inválido', 'Contraseña requerida'],
    })
  })

  it('uses a generic message for malformed error bodies', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('<html>Error</html>', { status: 500 })))
    await expect(apiRequest('/failure')).rejects.toMatchObject({
      status: 500,
      messages: ['No fue posible completar la solicitud.'],
    })
  })

  it('distinguishes network failures from intentional aborts', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')))
    await expect(apiRequest('/offline')).rejects.toBeInstanceOf(ApiError)
    await expect(apiRequest('/offline')).rejects.toMatchObject({ kind: 'network' })

    const abort = new DOMException('Aborted', 'AbortError')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(abort))
    await expect(apiRequest('/aborted')).rejects.toBe(abort)
  })

  it('notifies the session only for authenticated 401 responses', async () => {
    const onUnauthorized = vi.fn()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 401 })))

    await expect(
      apiRequest('/private', { token: 'fake-token', onUnauthorized }),
    ).rejects.toMatchObject({ status: 401 })
    expect(onUnauthorized).toHaveBeenCalledOnce()
  })
})
