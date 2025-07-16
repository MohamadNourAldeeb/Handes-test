class CustomError extends Error {
  errorCode;
  constructor(message, errorCode, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

export default CustomError;
