export function getApiBaseUrl() {
  const value = import.meta.env.VITE_API_BASE_URL

  if (value) return value

  if (import.meta.env.PROD) {
    throw new Error('VITE_API_BASE_URL is required in production.')
  }

  return '/api'
}
