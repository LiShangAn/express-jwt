const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
  console.log('enter verifyJWT middleware');
  const authHeader = req.headers['authorization'];
  console.log(authHeader);
  if (!authHeader) {
    return res.sendStatus(401);
  }
  const token = authHeader.split(' ')[1]; // Bearer token
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err, decode) => {
      if (err) return res.sendStatus(403); // invalid token
      res.name = decode.name;
      next();
    }
  );
};

module.exports = verifyJWT
;
