const { z } = require("zod");

const updateProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name cannot exceed 50 characters")
      .optional(),

    userName: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username cannot exceed 30 characters")
      .regex(
        /^[a-zA-Z0-9_.]+$/,
        "Username can only contain letters, numbers, underscore and period",
      )
      .optional(),

    bio: z
      .string()
      .trim()
      .max(250, "Bio cannot exceed 250 characters")
      .optional(),

    dob: z.union([z.coerce.date(), z.literal("")]).optional(),
  })
  .strict();

const userIdSchema = z
  .object({
   userId: z.string().uuid()
  })
  .strict();

const searchUserSchema = z
  .object({
    search: z.string().trim().min(1),
  })
  .strict();

module.exports = {
  updateProfileSchema,
  userIdSchema,
  searchUserSchema,
};
