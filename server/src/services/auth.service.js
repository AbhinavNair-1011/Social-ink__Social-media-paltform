const Session = require("../models/session.model");

const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");

const hashToken = require("../utils/hashToken");

const {
  accessCookieOptions,
  refreshCookieOptions,
} = require("../shared/cookieOptions");

async function createAuthenticatedSession({ user, req, res }) {
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

  session.refreshTokenHash = hashToken(refreshToken);

  await session.save();

  res.cookie("accessToken", accessToken, accessCookieOptions);

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
}

async function refreshAuthenticatedSession({ session, user, res }) {
  const accessToken = generateAccessToken({
    userId: user._id,
    email: user.email,
  });

  const refreshToken = generateRefreshToken({
    userId: user._id,
    sessionId: session._id,
  });

  session.refreshTokenHash = hashToken(refreshToken);

  await session.save();

  res.cookie("accessToken", accessToken, accessCookieOptions);

  res.cookie("refreshToken", refreshToken, refreshCookieOptions);
}

module.exports = {
  createAuthenticatedSession,
  refreshAuthenticatedSession,
};
