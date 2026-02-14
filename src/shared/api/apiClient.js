import axios from 'axios'
import { fromAxiosError } from '../error/fromAxiosError.js'
import { redirectToStudentSignin } from '../auth/redirectToStudentSignin.js'
import { getApiBaseUrl } from '../env/getApiBaseUrl.js'

const TRACE_HEADER_NAME = 'x-trace-id'

function createTraceId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `trace-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const traceId = createTraceId()
  config.headers = config.headers ?? {}
  config.headers[TRACE_HEADER_NAME] = traceId
  config.__traceId = traceId
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const traceId = error?.config?.__traceId
    const appError = fromAxiosError(error, { traceId })

    if (appError.code === 'UNAUTHENTICATED') {
      redirectToStudentSignin()
    }

    return Promise.reject(appError)
  },
)
