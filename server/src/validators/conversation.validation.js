const { z } = require("zod");

const createConversationSchema = z.object({
  userId: z.string().trim().min(1),
});

module.exports = {
  createConversationSchema,
};
