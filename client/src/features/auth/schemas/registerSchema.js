import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters"),

  userName: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters"),

  email: z.email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),

  dob: z.string(),
});