let warnedForMissingBaseUrlInDev = false

export function getApiBaseUrl() {
  const value = import.meta.env.VITE_API_BASE_URL

  if (value) return value

  if (import.meta.env.PROD) {
    throw new Error('VITE_API_BASE_URL is required in production.')
  }

  if (!warnedForMissingBaseUrlInDev) {
    warnedForMissingBaseUrlInDev = true
    console.warn('[env] VITE_API_BASE_URL is missing. Falling back to /api in development.')
  }

  return '/api'
}
