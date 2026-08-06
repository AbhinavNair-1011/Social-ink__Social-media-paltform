const { z } = require("zod");

const createConversationSchema = z.object({
  userId: z.string().uuid(),
});

module.exports = {
  createConversationSchema,
};
