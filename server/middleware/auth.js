const jwt = require('jsonwebtoken');
const { noToken } = require('../shared/constants');

// Check if valid token
module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send(noToken);
  try {
    const decoded = jwt.verify(token, process.env.jwtPrivateKey);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(401).send('Invalid token.');
  }
};

 