import axios from 'axios'
import { AppError } from './AppError.js'
import { APP_ERROR_CODES } from './appErrorCodes.js'

export function fromAxiosError(error) {
  if (!axios.isAxiosError(error)) {
    return new AppError({
      code: APP_ERROR_CODES.UNKNOWN,
      message: 'Unknown error',
      cause: error,
    })
  }

  if (!error.response) {
    return new AppError({
      code: APP_ERROR_CODES.NETWORK_ERROR,
      message: 'Network error',
      cause: error,
    })
  }

  const status = error.response.status
  if (status === 401) {
    return new AppError({
      code: APP_ERROR_CODES.UNAUTHENTICATED,
      status,
      message: 'Unauthenticated',
      cause: error,
      details: error.response.data,
    })
  }

  if (status === 403) {
    return new AppError({
      code: APP_ERROR_CODES.FORBIDDEN,
      status,
      message: 'Forbidden',
      cause: error,
      details: error.response.data,
    })
  }

  if (status === 404) {
    return new AppError({
      code: APP_ERROR_CODES.NOT_FOUND,
      status,
      message: 'Not found',
      cause: error,
      details: error.response.data,
    })
  }

  return new AppError({
    code: APP_ERROR_CODES.HTTP_ERROR,
    status,
    message: 'HTTP error',
    cause: error,
    details: error.response.data,
  })
}

