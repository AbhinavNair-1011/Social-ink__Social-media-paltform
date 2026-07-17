const { z } = require("zod");

 const createConversationSchema = z.object({
  body: z.object({
    userId: z.string().trim().min(1),
  }),
});

module.exports={
  createConversationSchema
}