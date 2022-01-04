const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/user');

const handleLogin = async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) return res.sendStatus(400).json({'message': 'Username and password are required.'});

  const foundUser = await User.findOne({name: name});
  if (!foundUser) return res.sendStatus(401); // Unauthorized

  const match = await bcrypt.compare(password, foundUser.password);

  if (match) {
    // create JWTs
    const accessToken = jwt.sign(
      {
        name: foundUser.name
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '30s' });

    const refreshToken = jwt.sign(
      {
        name: foundUser.name
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: '1d' });

    if (foundUser.tokens === undefined) {
      foundUser.tokens = [];
    }

    // Saving refreshToken with current user
    // foundUser.tokens = foundUser.tokens.concat({token: refreshToken});
    foundUser.token = refreshToken;

    await User.findOneAndUpdate({name: foundUser.name}, foundUser);

    // res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
    res.cookie('jwt', refreshToken);

    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
