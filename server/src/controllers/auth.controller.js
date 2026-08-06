const bcrypt = require("bcryptjs");

const userRepository = require("../repositories/user.repository");

const sessionRepository = require("../repositories/session.repository");
const verificationRepository = require("../repositories/verification.repository");
const { createVerification } = require("../services/verification.service");
const crypto = require("crypto");

const AppError = require("../utils/appError");

const {
  createAuthenticatedSession,
  refreshAuthenticatedSession,
} = require("../services/auth.service");

const { verifyToken } = require("../utils/jwt");

const { sendEmail } = require("../services/email.service");
const hashToken = require("../utils/hashToken");
const {
  accessCookieOptions,
  refreshCookieOptions,
} = require("../shared/cookieOptions");

async function register(req, res) {
  const { name, email, password, userName, dob, twoFactorEnabled } = req.body;

  const existingEmail = await userRepository.findByEmail(email);

  if (existingEmail && !existingEmail.isEmailVerified) {
    throw new AppError("Please verify your email first.", 403, "verifyEmail");
  } else if (existingEmail) {
    throw new AppError(
      "Email already exists please continue to login",
      409,
      "ConflictError",
    );
  }

  const existingUsername = await userRepository.findByUserName(userName);

  if (existingUsername) {
    throw new AppError("Username already exists", 409, "ConflictError");
  }

  const hashedPassword = await bcrypt.hash(password, 3);

  const user = await userRepository.createUser({
    name,
    email,
    password: hashedPassword,
    userName,
    dob,
    twoFactorEnabled,
  });
  const code = await createVerification({
    userId: user.id,
    purpose: "email-verification",
  });

  await sendEmail({
    to: user.email,
    subject: "Verify your email",
    html: `
      <h2>Email Verification</h2>
      <p>Your verification code is</p>
      <h1>${code}</h1>
  `,
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

  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new AppError("Invalid credentials", 401, "AuthenticationError");
  }
  if (!user.isEmailVerified) {
    throw new AppError("Please verify your email first.", 403, "verifyEmail");
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new AppError("Invalid credentials", 401, "AuthenticationError");
  }

  if (user.twoFactorEnabled) {
    const code = await createVerification({
      userId: user.id,
      purpose: "login-2fa",
    });

    await sendEmail({
      to: user.email,
      subject: "Login Verification Code",
      html: `
      <h2>Two-Factor Authentication</h2>

      <p>Your verification code is:</p>

      <h1>${code}</h1>

      <p>This code expires in 10 minutes.</p>
    `,
    });

    return res.status(200).json({
      success: true,
      data: {
        requiresTwoFactor: true,
        email: user.email,
      },
      error: null,
    });
  }

  await createAuthenticatedSession({
    user,
    req,
    res,
  });

  return res.status(200).json({
    success: true,
    data: {
      requiresTwoFactor: false,

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
    throw new AppError("Refresh token missing", 401, "AuthenticationError");
  }

  const decoded = verifyToken(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
  );

  const session = await sessionRepository.findById(decoded.sessionId);

  if (!session) {
    throw new AppError("Session not found", 401, "AuthenticationError");
  }

  const incomingTokenHash = hashToken(refreshToken);

  if (incomingTokenHash !== session.refreshTokenHash) {
    throw new AppError("Invalid refresh token", 401, "AuthenticationError");
  }

  const user = await userRepository.findById(decoded.userId);

  if (!user) {
    throw new AppError("User not found", 401, "AuthenticationError");
  }

  await refreshAuthenticatedSession({
    session,
    user,
    res,
  });

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

  await sessionRepository.deleteById(decoded.sessionId);

  res.clearCookie("accessToken", accessCookieOptions);

  res.clearCookie("refreshToken", refreshCookieOptions);

  return res.status(200).json({
    success: true,
    data: null,
    error: null,
  });
}

async function forgotPassword(req, res) {
  const { email } = req.body;

  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new AppError("User not found", 404, "NotFoundError");
  }

  const code = await createVerification({
    userId: user.id,
    purpose: "forgot-password",
  });

  await sendEmail({
    to: user.email,

    subject: "Reset Password",

    html: `<h2>Your verification code is ${code}</h2>`,
  });

  return res.status(200).json({
    success: true,
    data: null,
    error: null,
  });
}
async function resetPassword(req, res) {
  const { code, password } = req.body;

  const codeHash = hashToken(code);

  const verification = await verificationRepository.findVerification({
    codeHash,
    purpose: "forgot-password",
  });

  if (!verification) {
    throw new AppError(
      "Invalid or expired verification code",
      400,
      "ValidationError",
    );
  }

  const user = await userRepository.findById(verification.userId);

  if (!user) {
    throw new AppError("User not found", 404, "NotFoundError");
  }

  await userRepository.updatePassword(user.id, await bcrypt.hash(password, 10));

  await verificationRepository.deleteById(verification.id);
  await sessionRepository.deleteByUserId(user.id);

  res.clearCookie("accessToken", accessCookieOptions);

  res.clearCookie("refreshToken", refreshCookieOptions);

  return res.status(200).json({
    success: true,
    data: null,
    error: null,
  });
}
async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;

  const user = await userRepository.findById(req.user.userId);

  if (!user) {
    throw new AppError("User not found", 404, "NotFoundError");
  }

  const isPasswordCorrect = await bcrypt.compare(
    currentPassword,
    user.password,
  );

  if (!isPasswordCorrect) {
    throw new AppError(
      "Current password is incorrect",
      401,
      "AuthenticationError",
    );
  }

  await userRepository.updatePassword(
    user.id,
    await bcrypt.hash(newPassword, 10),
  );

  await sessionRepository.deleteByUserId(user.id);

  res.clearCookie("accessToken", accessCookieOptions);

  res.clearCookie("refreshToken", refreshCookieOptions);

  return res.status(200).json({
    success: true,
    data: null,
    error: null,
  });
}

async function logoutAll(req, res) {
  await sessionRepository.deleteById(decoded.sessionId);

  res.clearCookie("accessToken", accessCookieOptions);

  res.clearCookie("refreshToken", refreshCookieOptions);

  return res.status(200).json({
    success: true,
    data: null,
    error: null,
  });
}

async function sendEmailVerification(req, res) {
  const { email } = req.body;

  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new AppError("User not found", 404, "NotFoundError");
  }

  if (user.isEmailVerified) {
    throw new AppError("Email already verified", 409, "ConflictError");
  }

  const code = await createVerification({
    userId: user.id,
    purpose: "email-verification",
  });

  await sendEmail({
    to: user.email,
    subject: "Verify your email",
    html: `
      <h2>Email Verification</h2>
      <p>Your verification code is:</p>
      <h1>${code}</h1>
      <p>This code expires in 10 minutes.</p>
    `,
  });

  return res.status(200).json({
    success: true,
    data: null,
    error: null,
  });
}
async function verifyEmail(req, res) {
  const { email, code } = req.body;

  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new AppError("User not found", 404, "NotFoundError");
  }

  const codeHash = hashToken(code);

  const verification = await verificationRepository.findVerificationByUser({
  userId: user.id,
  purpose: "email-verification",
  codeHash,
});
  if (!verification) {
    throw new AppError(
      "Invalid or expired verification code",
      400,
      "ValidationError",
    );
  }

  await userRepository.verifyEmail(user.id);

await verificationRepository.deleteById(verification.id);

  return res.status(200).json({
    success: true,
    data: null,
    error: null,
  });
}

async function changeEmail(req, res) {
  const { oldEmail, newEmail } = req.body;

  const user = await userRepository.findByEmail(oldEmail);

  if (!user) {
    throw new AppError("User not found", 404, "NotFoundError");
  }

  if (user.isEmailVerified) {
    throw new AppError("Email is already verified", 409, "ConflictError");
  }

  const existingUser = await userRepository.findByEmail(newEmail);

  if (existingUser) {
    throw new AppError("Email already exists", 409, "ConflictError");
  }

  await userRepository.changeEmail(user.id, newEmail);

  await verificationRepository.deleteMany({
  userId: user.id,
  purpose: "email-verification",
});

  const code = await createVerification({
    userId: user.id,
    purpose: "email-verification",
  });

  await sendEmail({
    to: newEmail,
    subject: "Verify your email",
    html: `
      <h2>Email Verification</h2>

      <p>Your verification code is</p>

      <h1>${code}</h1>
    `,
  });

  return res.status(200).json({
    success: true,
    data: null,
    error: null,
  });
}
async function verifyTwoFactor(req, res) {
  const { email, code } = req.body;

  const user = await userRepository.findByEmail(email);

  if (!user) {
    throw new AppError("User not found", 404, "NotFoundError");
  }

  const codeHash = hashToken(code);

  const verification = await verificationRepository.findVerificationByUser({
  userId: user.id,
  purpose: "login-2fa",
  codeHash,
});

  if (!verification) {
    throw new AppError(
      "Invalid or expired verification code",
      400,
      "ValidationError",
    );
  }

await verificationRepository.deleteById(verification.id);
  await createAuthenticatedSession({
    user,
    req,
    res,
  });

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
module.exports = {
  register,
  login,
  refresh,
  logout,
  logoutAll,
  forgotPassword,
  resetPassword,
  changePassword,
  sendEmailVerification,
  verifyEmail,
  changeEmail,
  verifyTwoFactor,
};
