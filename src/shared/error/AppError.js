export class AppError extends Error {
  /**
   * @param {object} args
   * @param {string} args.code
   * @param {string} args.message
   * @param {number | undefined} [args.status]
   * @param {unknown} [args.cause]
   * @param {unknown} [args.details]
   */
  constructor({ code, message, status, cause, details }) {
    super(message)
    this.name = 'AppError'
    this.code = code
    this.status = status
    this.details = details
    this.cause = cause
  }
}

export function isAppError(error) {
  return error instanceof AppError
}

