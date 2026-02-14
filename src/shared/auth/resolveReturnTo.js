export function resolveReturnTo(returnToParam, fallbackPath) {
  if (typeof returnToParam === 'string') {
    const trimmed = returnToParam.trim()
    const isInternalPath = trimmed.startsWith('/') && !trimmed.startsWith('//')

    if (isInternalPath) {
      return trimmed
    }
  }

  return fallbackPath
}
