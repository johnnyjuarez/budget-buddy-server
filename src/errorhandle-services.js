function errorHandler(error, statusCode, req, res, next) {
  let response = {
    error: { message: error.message, error },
    statusCode,
  };
  next();
}
