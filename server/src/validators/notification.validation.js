const { z } = require("zod");

const notificationIdSchema = z.object({
  notificationId: z.string().regex(/^[0-9a-fA-F]{24}$/),
});
module.exports = {
  notificationIdSchema,
};
