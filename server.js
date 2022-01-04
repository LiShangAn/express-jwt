const express = require('express');
const app = express();
const credentials = require('./middleware/credentials');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');

const mongoose = require('mongoose');
const verifyJWT = require('./middleware/verifyJWT');

const authController = require('./controllers/authController');
const registerController = require('./controllers/registerController');
const refreshTokenController = require('./controllers/refreshTokenController');

const port = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost/jwt', {
  useNewUrlParser: true, useUnifiedTopology: true
});

app.use(credentials);

app.use(cors(corsOptions));

app.use(express.json());

// middleware for cookies
app.use(cookieParser());

app.post('/register', registerController.handleNewUser);
app.post('/auth', authController.handleLogin);
app.get('/refresh', refreshTokenController.handleRefreshToken);

app.get('/test', (req, res) => {
  res.send('success');
});

app.use(verifyJWT);
app.get('/users', (req, res) => {
  res.send('success');
});

app.listen(port);
