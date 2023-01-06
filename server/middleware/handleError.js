// eslint-disable-next-line no-unused-vars
function handleError(err, req, res, next) {
  const code = res.statusCode ? res.statusCode : 500;
  res.status(code).json({ message: err.message });
}

export default handleError;
