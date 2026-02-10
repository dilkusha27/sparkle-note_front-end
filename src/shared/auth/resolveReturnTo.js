export function resolveReturnTo(returnToParam, fallbackPath) {
  if (returnToParam && returnToParam.startsWith('/')) {
    return returnToParam
  }

  return fallbackPath
}
