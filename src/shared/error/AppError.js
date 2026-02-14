export class AppError extends Error {
  /**
   * @param {object} args
   * @param {string} args.code
   * @param {string} args.message
   * @param {number | undefined} [args.status]
   * @param {unknown} [args.cause]
   * @param {unknown} [args.details]
   * @param {string | undefined} [args.traceId]
   */
  constructor({ code, message, status, cause, details, traceId }) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.status = status
    this.details = details
    this.cause = cause
    this.traceId = traceId
  }
}

export function isAppError(error) {
  return error instanceof AppError
}
