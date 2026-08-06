const { z } = require("zod");

const notificationIdSchema = z.object({
  notificationId: z.string().uuid()
});
module.exports = {
  notificationIdSchema,
};
