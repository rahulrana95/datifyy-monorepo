export class AdminError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string
  ) {
    super(message);
    this.name = 'AdminError';
  }
}

export class InvalidEnumDataError extends AdminError {
  constructor(message = 'Invalid enum data provided') {
    super(message, 400, 'INVALID_ENUM_DATA');
  }
}

export class DatabaseQueryError extends AdminError {
  constructor(message = 'Database query failed') {
    super(message, 500, 'DATABASE_QUERY_ERROR');
  }
}