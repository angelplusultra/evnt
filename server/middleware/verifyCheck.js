function verifyCheck(req, res, next) {
  if (req.user.isVerified) return next();

  const difference = Date.now() - Date.parse(req.user.createdAt);

  const days = difference / 86400000;

  if (days > 10) {
    res.status(401);
    throw new Error('User has not verified their account');
  } else {
    return next();
  }
}

export default verifyCheck;
