const { z } = require("zod");

const updateProfileSchema = z
  .object({
    name: z.string().trim().min(3).optional(),

    bio: z.string().trim().max(300).optional(),

    dob: z.string().trim().optional(),
  })
  .strict();

module.exports = {
  updateProfileSchema,
};