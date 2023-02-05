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
    console.log(token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Users.findById(decoded.id).select('-password')
    const artist = await Artists.findById(decoded.id).select('-password')
    if(!user && !artist){
      res.status(401)
      return next(new Error('Unauthorized'))
    }
    req.user = artist ? artist : user

    return next();
  } catch (error) {
    res.status(401);
    return next(new Error('Invalid Token, please acquire a new token'));
  }
}

export default authorize;
