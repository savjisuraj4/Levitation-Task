import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).send( 'Unauthorized' );
  }

  try {
    const decoded = jwt.verify(token,process.env.JWT_SECERT_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).send('Invalid token');
  }
};

export default authenticate;
