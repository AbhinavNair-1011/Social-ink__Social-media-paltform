const jwt = require("jsonwebtoken");

function verifyToken(token, secret) {
  return jwt.verify(token, secret);
}

module.exports = verifyToken;