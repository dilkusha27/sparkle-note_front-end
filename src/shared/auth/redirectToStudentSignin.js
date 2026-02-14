import { resolveReturnTo } from './resolveReturnTo.js'

export function redirectToStudentSignin() {
  if (typeof window === 'undefined') return

  const currentPath = window.location.pathname || '/'
  if (currentPath.startsWith('/student/signin')) return

  const returnToRaw = `${currentPath}${window.location.search || ''}${window.location.hash || ''}`
  const returnTo = resolveReturnTo(returnToRaw, '/')

  const params = new URLSearchParams()
  params.set('returnTo', returnTo)

  window.location.assign(`/student/signin?${params.toString()}`)
}
