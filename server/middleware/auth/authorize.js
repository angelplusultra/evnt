import jwt from 'jsonwebtoken';
import Users from '../../models/Users.js';

async function authorize(req, res, next) {
  if (
    !req.headers.authorization
    || !req.headers.authorization.startsWith('Bearer')
  ) {
    res.status(401);
    return next(new Error('Unauthorized, please include token with request'));
  }

  const token = req.headers.authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await Users.findById(decoded.id).lean();

    delete req.user.password;

    return next();
  } catch (error) {
    res.status(401);
    return next(new Error('Invalid Token, please acquire a new token'));
  }
}

export default authorize;
