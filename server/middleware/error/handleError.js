// eslint-disable-next-line no-unused-vars
function handleError(err, req, res, next) {
  const { NODE_ENV } = process.env;
  const code = res.statusCode ? res.statusCode : 500;
  res.status(code).json({ message: err.message, stack: NODE_ENV === 'prod' ? undefined : err.stack });
}

export default handleError;
