import axios from 'axios'
import { fromAxiosError } from '../error/fromAxiosError.js'
import { redirectToStudentSigninIfNeeded } from '../auth/redirectToStudentSigninIfNeeded.js'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const appError = fromAxiosError(error)

    if (appError.code === 'UNAUTHENTICATED') {
      redirectToStudentSigninIfNeeded()
    }

    return Promise.reject(appError)
  },
)
