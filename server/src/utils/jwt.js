const jwt = require("jsonwebtoken");

function generateAccessToken(payload) {
  return jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );
}

function generateRefreshToken(payload) {
  return jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

function verifyToken(token, secret) {
  return jwt.verify(token, secret);
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
};