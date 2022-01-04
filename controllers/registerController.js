require('dotenv').config();

const User = require('../models/user');

const handleNewUser = async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) return res.sendStatus(400).json({'message': 'Username and password are required.'});

  const duplicate = await User.findOne({name: name});
  if (duplicate) return res.sendStatus(409); // Conflict

  try {
    let user = new User();
    user.name = name;
    user.password = password;
    await user.save();

    res.status(201).json({ 'success': `New user ${user} created!` });
  } catch (err) {
    res.status(500).json({ 'message': err.message });
  }
};

module.exports = { handleNewUser };
