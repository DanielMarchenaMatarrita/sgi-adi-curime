let cachedApiUrl: string | undefined

export function getApiUrl(): string {
  if (cachedApiUrl) {
    return cachedApiUrl
  }

  const value = import.meta.env.VITE_API_URL?.trim()
  if (!value) {
    throw new Error('Falta la variable de entorno VITE_API_URL.')
  }

  let url: URL
  try {
    url = new URL(value)
  } catch {
    throw new Error('VITE_API_URL debe ser una URL HTTP(S) absoluta.')
  }

  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  ) {
    throw new Error('VITE_API_URL debe ser un origen HTTP(S) válido.')
  }

  cachedApiUrl = `${url.origin}/`
  return cachedApiUrl
}

export function resetEnvironmentCacheForTests(): void {
  cachedApiUrl = undefined
}
