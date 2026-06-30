import { z } from "zod";

export const postSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Post cannot be empty.")
    .max(500, "Post cannot exceed 500 characters."),
});