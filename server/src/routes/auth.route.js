const express = require("express");

const router = express.Router();

const validate = require("../middlewares/validate");

const {
  registerUsersSchema,
  loginUsersSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  changePasswordSchema,
  changeEmailSchema,
  verifyTwoFactorSchema,
} = require("../validators/auth.validation");

const {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  sendEmailVerification,
  verifyEmail,
  changePassword,
  logoutAll,
  changeEmail,
  verifyTwoFactor,
} = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth");

router.post("/register", validate(registerUsersSchema), register);

router.post("/login", validate(loginUsersSchema), login);
router.post("/refresh", refresh);

router.post("/logout", logout);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);

router.post("/reset-password", validate(resetPasswordSchema), resetPassword);

router.post("/send-email-verification", sendEmailVerification);

router.post("/verify-email", validate(verifyEmailSchema), verifyEmail);

router.patch(
  "/change-password",
  authMiddleware,
  validate(changePasswordSchema),
  changePassword,
);
router.patch("/change-email", validate(changeEmailSchema), changeEmail);

router.post("/logout-all", authMiddleware, logoutAll);
router.post("/verify-2fa", validate(verifyTwoFactorSchema), verifyTwoFactor);
module.exports = router;
