const { z } = require("zod");

const createMessageSchema = z
  .object({
    conversationId: z.string(),

    text: z.string().trim().optional(),

    imageUrl: z.string().trim().optional(),
  })
  .refine(
    (data) =>
      data.text?.trim() || data.imageUrl?.trim(),
    {
      message: "Message cannot be empty.",
    },
  );

module.exports = {
  createMessageSchema,
};