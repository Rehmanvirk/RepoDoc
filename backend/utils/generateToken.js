// backend/utils/generateToken.js

const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  // 'sign' creates a new token
  return jwt.sign(
    { id }, // This is the "payload" we want to store in the token
    process.env.JWT_SECRET, // Our private secret key
    { expiresIn: '30d' } // The token will be valid for 30 days
  );
};

module.exports = generateToken;