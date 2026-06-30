import { z } from "zod";

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters."),

  bio: z
    .string()
    .trim()
    .max(250, "Bio cannot exceed 250 characters."),
});