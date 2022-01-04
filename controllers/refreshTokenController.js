const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/user');

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({tokens: refreshToken});
  if (!foundUser) return res.sendStatus(403); // Forbidden

  // evaluate jwt
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err || foundUser.name !== decoded.name) return res.sendStatus(403);

      console.log('decoded.name: ' + decoded.name);

      const accessToken = jwt.sign(
        { name: decoded.name },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '30s' }
      );
      res.json({ accessToken });
    }
  );
};

module.exports = { handleRefreshToken };
