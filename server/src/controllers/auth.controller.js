const bcrypt = require("bcryptjs");

const User = require("../models/user.model");

const Session = require("../models/session.model");

const AppError = require("../utils/AppError");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} = require("../utils/jwt.js");

const hashToken = require("../utils/hashToken");
const {
  accessCookieOptions,
  refreshCookieOptions,
} = require("../shared/cookieOptions");

async function register(req, res) {
  const { name, email, password, userName, dob } = req.body;

  const existingEmail = await User.findOne({ email });

  if (existingEmail) {
   throw new AppError("Email already exists", 409, "ConflictError");
  }

  const existingUsername = await User.findOne({
    userName,
  });

  if (existingUsername) {
    throw new AppError("Username already exists", 409, "ConflictError");
  }

  const hashedPassword = await bcrypt.hash(password, 3);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    userName,
    dob,
  });

  return res.status(201).json({
    success: true,
    error: null,
    data: {
      user: {
        name: user.name,
        email: user.email,
        userName: user.userName,
        dob: user.dob,
      },
    },
  });
}

async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("Invalid credentials", 401, "AuthenticationError");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new AppError("Invalid credentials", 401, "AuthenticationError");
  }

  const session = await Session.create({
    userId: user._id,

    refreshTokenHash: "temporary",

    userAgent: req.headers["user-agent"],

    ipAddress: req.ip,

    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const accessToken = generateAccessToken({
    userId: user._id,
    email: user.email,
  });

  const refreshToken = generateRefreshToken({
    userId: user._id,
    sessionId: session._id,
  });
  const hashedRefreshToken = hashToken(refreshToken);
  session.refreshTokenHash = hashedRefreshToken;

  await session.save();

  res.cookie("accessToken", accessToken, accessCookieOptions);

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
  return res.status(200).json({
    success: true,

    data: {
      user: {
        name: user.name,
        email: user.email,
        userName: user.userName,
      },
    },

    error: null,
  });
}

async function refresh(req, res) {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
   throw  new AppError("Refresh token missing", 401, "AuthenticationError");
  }

  const decoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);

  const session = await Session.findById(decoded.sessionId);
  if (!session) {
    throw new AppError("Session not found", 401, "AuthenticationError");
  }
  const incomingTokenHash = hashToken(refreshToken);

  if (incomingTokenHash !== session.refreshTokenHash) {
    throw new AppError("Invalid refresh token", 401, "AuthenticationError");
  }

  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new AppError("User not found", 401, "AuthenticationError");
  }

  const accessToken = generateAccessToken({
    userId: user._id,
    email: user.email,
  });
  const newRefreshToken = generateRefreshToken({
    userId: user._id,
    sessionId: session._id,
  });

  const hashedRefreshToken = hashToken(newRefreshToken);

  session.refreshTokenHash = hashedRefreshToken;

  res.cookie("accessToken", accessToken, accessCookieOptions);

  res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);

  await session.save();

  return res.status(200).json({
    success: true,
    data: null,
    error: null,
  });
}

async function logout(req, res, next) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AppError("Refresh token missing", 401, "AuthenticationError");
  }

  const decoded = verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);

  await Session.findByIdAndDelete(decoded.sessionId);

  res.clearCookie("accessToken", accessCookieOptions);

  res.clearCookie("refreshToken", refreshCookieOptions);

  return res.status(200).json({
    success: true,
    data: null,
    error: null,
  });
}

// async function me(req, res) {
//   const user = await User.findById(req.user.userId).select(
//     "name email userName dob bio profileImage",
//   );

//   if (!user) {
//     throw new AppError("User not found", 404, "NotFoundError");
//   }

//   return res.status(200).json({
//     success: true,
//     data: {
//       user,
//     },
//     error: null,
//   });
// }
module.exports = {
  register,
  login,
  refresh,
  logout,
};
