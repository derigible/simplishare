export class UserNotAuthenticated extends Error {
  constructor(params){
    super(params)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UserNotAuthenticated);
    }
    this.name = 'UserNotAuthenticated'
  }
}
export class ServerError extends Error {
  constructor(data, ...params){
    super(...params)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ServerError);
    }

    this.name = 'ServerError'
    this.data = data
  }
}
export class BadRequestData extends Error {
  constructor(data, ...params){
    super(...params)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BadRequestData);
    }

    this.name = 'BadRequestData'
    this.data = data
  }
}
export class NotFoundError extends Error {
  constructor(status, data, ...params){
    super(...params)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NotFoundError);
    }

    this.name = 'NotFoundError'
    this.data = data
    this.status = status
  }
}
export class UnknownResponseError extends Error {
  constructor(status, data, ...params){
    super(...params)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UnknownResponseError);
    }

    this.name = 'UnknownResponseError'
    this.data = data
    this.status = status
  }
}
export class PossibleTimeout extends Error {
  constructor(status, data, ...params){
    super(...params)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PossibleTimeout);
    }

    this.name = 'PossibleTimeout'
    this.data = data
    this.status = status
  }
}
export class FetchSetupError extends Error {
  constructor(params){
    super(params)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchSetupError);
    }

    this.name = 'FetchSetupError'
  }
}

export function axiosError (error) {
  if (error.response) {
    if (error.response.status === 401) {
      throw new UserNotAuthenticated()
    }
    if ([400, 422].includes(error.response.status)) {
      throw new BadRequestData(error.response.data)
    }
    if (500 ===error.response.status) {
      throw new ServerError(error.response.data)
    }
    if (404 ===error.response.status) {
      throw new NotFoundError(error.response.data)
    }
    throw new UnknownResponseError(error.response.status, error.response.data)
  } else if (error.request) {
    throw new PossibleTimeout(error.request.status, error.request.data)
  } else {
    throw new FetchSetupError(error.message)
  }
}
