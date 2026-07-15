const z = require("zod");

const registerUsersSchema = z.object({
  name: z.string().trim().min(3, "Full name must be at least 3 characters"),

  userName: z.string().trim().min(3, "Username must be at least 3 characters"),

  email: z.email("Invalid email address"),

  password: z.string().min(8, "Password must be at least 8 characters"),
  twoFactorEnabled: z.boolean(),
});

const loginUsersSchema = z.object({
  email: z.email("Invalid email address"),

  password: z.string().min(1, "Password is required"),
});

const forgotPasswordSchema = z
  .object({
    email: z.string().email().trim().toLowerCase(),
  })
  .strict();

const resetPasswordSchema = z
  .object({
    code: z.string().trim().length(6),

    password: z.string().trim().min(6),
  })
  .strict();
const verifyEmailSchema = z
  .object({
    email: z.string().trim().toLowerCase().email(),

    code: z.string().trim().length(6),
  })
  .strict();

const changePasswordSchema = z
  .object({
    currentPassword: z.string().trim(),

    newPassword: z.string().trim().min(6),
  })
  .strict();

const changeEmailSchema = z
  .object({
    oldEmail: z.string().trim().toLowerCase().email(),

    newEmail: z.string().trim().toLowerCase().email(),
  })
  .strict();

const verifyTwoFactorSchema = z
  .object({
    email: z.string().trim().toLowerCase().email(),

    code: z.string().trim().length(6),
  })
  .strict();
module.exports = {
  registerUsersSchema,
  loginUsersSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  changePasswordSchema,
  changeEmailSchema,
  verifyTwoFactorSchema,
};
