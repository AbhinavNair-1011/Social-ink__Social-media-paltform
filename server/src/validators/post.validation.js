const { z } = require("zod");

const createPostSchema = z
  .object({
    content: z.string().trim().min(1).max(1000),
  })
  .strict();

const updatePostSchema = z
  .object({
    content: z.string().trim().min(1).max(1000),
  })
  .strict();

const getPostsSchema = z
  .object({
    page: z.coerce.number().min(1).default(1),

    limit: z.coerce.number().min(1).max(20).default(10),
  })
  .strict();

  const postIdSchema = z
  .object({
    postId: z.string().trim(),
  })
  .strict();

module.exports = {
  createPostSchema,
  updatePostSchema,
  getPostsSchema,
  postIdSchema,
};


