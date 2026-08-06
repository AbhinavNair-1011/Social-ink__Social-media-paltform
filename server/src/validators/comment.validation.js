const { z } = require("zod");

const createCommentSchema = z
  .object({
    content: z
      .string()
      .trim()
      .min(1)
      .max(500),
  })
  .strict();

const updateCommentSchema = z
  .object({
    content: z
      .string()
      .trim()
      .min(1)
      .max(500),
  })
  .strict();

const commentIdSchema = z
  .object({
    commentId: z.string().uuid(),
  })
  .strict();

module.exports = {
  createCommentSchema,
  updateCommentSchema,
  commentIdSchema,
};