const AppError = require("../utils/appError");

const { verifyToken } = require("../utils/jwt");

async function authMiddleware(req, res, next) {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      throw new AppError("Unauthorized", 401, "AuthenticationError");
    }

    const decoded = verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET);

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    throw new AppError("auth error", 401);
  }
}



module.exports = authMiddleware;
