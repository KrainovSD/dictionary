import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config({ path: 'config.env', silent: true });
const secretAccessToken = process.env.SECRET_ACCESS_TOKEN;

export default (req, res, next) => {
  try {
    let token = req.headers.authorization?.replace(/Bearer\s?/, '');

    if (!token) {
      return res.status(401).json({
        message: 'Требуется авторизация!',
      });
    }
    let decoded = jwt.verify(token, secretAccessToken);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      message: 'Требуется авторизация!',
    });
  }
};
