import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email"),

  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(3, "Name must be at least 3 characters"),

  userName: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "Username must be at least 3 characters"),

  email: z.string().trim().toLowerCase().email("Please enter a valid email"),

  password: z.string().min(6, "Password must be at least 6 characters"),

  dob: z.string().min(1, "Date of birth is required"),
  twoFactorEnabled: z.boolean(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email"),
});

export const resetPasswordSchema = z.object({
  code: z.string().trim().length(6, "Verification code must be 6 digits"),

  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const verifyEmailSchema = z.object({
  email: z.string().trim().toLowerCase().email("Please enter a valid email"),

  code: z.string().trim().length(6, "Verification code must be 6 digits"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),

  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});
export const changeEmailSchema = z.object({
  oldEmail: z.string().trim().toLowerCase().email("Please enter a valid email"),

  newEmail: z.string().trim().toLowerCase().email("Please enter a valid email"),
});

export const verifyTwoFactorSchema = z.object({
    email: z.string().trim().toLowerCase().email(),

    code: z.string().trim().length(6),
  })
  .strict();
