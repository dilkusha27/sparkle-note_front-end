import axios from 'axios'
import { fromAxiosError } from '../error/fromAxiosError.js'
import { redirectToStudentSigninIfNeeded } from '../auth/redirectToStudentSigninIfNeeded.js'
import { getApiBaseUrl } from '../env/getApiBaseUrl.js'

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
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
