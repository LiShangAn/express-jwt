const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  description: {
    type: String
  },

  hobby: [{
    name: {
      type: String
    }
  }],

  token: {
    type: String
  }

  // tokens: [{
  //   token: {
  //     type: String,
  //     required: true
  //   }
  // }]
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

// userSchema.methods.generateAuthToken = async function () {
//   const user = this;
//   const accessToken = jwt.sign(
//     {
//       name: user.name
//     },
//     process.env.ACCESS_TOKEN_SECRET,
//     { expiresIn: '30s' });

//   const refreshToken = jwt.sign(
//     {
//       name: user.name
//     },
//     process.env.REFRESH_TOKEN_SECRET,
//     { expiresIn: '1d' });

//   if (user.tokens === undefined) {
//     user.tokens = [];
//   }

//   // Saving refreshToken with current user
//   user.tokens = user.tokens.concat({refreshToken});

//   // await user.save();
//   await this.findOneAndUpdate({name: user.name}, user);

//   return {
//     accessToken: accessToken,
//     refreshToken: refreshToken
//   };
// };

// userSchema.statics.findByCredentials = async (compare, password) => {
//   const isMatch = await bcrypt.compare(password, compare);
//   console.log(isMatch);
//   if (!isMatch) {
//     throw new Error('Unable to Login');
//   }
// };

module.exports = mongoose.model('User', userSchema);
