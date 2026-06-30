const z = require("zod");

const registerUsersSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters"),

  userName: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters"),

  email: z
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

const loginUsersSchema = z.object({
  email: z.email("Invalid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

module.exports = {
  registerUsersSchema,
  loginUsersSchema,
};