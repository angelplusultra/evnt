// eslint-disable-next-line no-unused-vars
function handleError(err, req, res, next) {
  const { NODE_ENV } = process.env;
  const code = res.statusCode ? res.statusCode : 500;

  // ! unsure if this is stable error handling but I am experimenting with arrays of errors, specifically with the event creation validation middleware
  if (Array.isArray(err)) {
    return res.status(code).json({
      errors: err.map((e) => ({
        message: e.message,
        stack: NODE_ENV === 'prod' ? undefined : e.stack,
      })),
    });
  }
  return res.status(code).json({ message: err.message, stack: NODE_ENV === 'prod' ? undefined : err.stack });
}

export default handleError;
