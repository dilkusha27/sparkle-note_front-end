import { APP_ERROR_CODES } from './appErrorCodes.js'

export function toUserMessage(error) {
  if (!error || typeof error !== 'object') return '알 수 없는 오류가 발생했어요.'

  const code = /** @type {{code?: string}} */ (error).code

  switch (code) {
    case APP_ERROR_CODES.NETWORK_ERROR:
      return '네트워크 오류가 발생했어요. 잠시 후 다시 시도해주세요.'
    case APP_ERROR_CODES.UNAUTHENTICATED:
      return '로그인이 필요해요.'
    case APP_ERROR_CODES.FORBIDDEN:
      return '권한이 없어요.'
    case APP_ERROR_CODES.NOT_FOUND:
      return '요청한 정보를 찾을 수 없어요.'
    case APP_ERROR_CODES.HTTP_ERROR:
      return '요청 처리 중 오류가 발생했어요.'
    default:
      return '알 수 없는 오류가 발생했어요.'
  }
}

