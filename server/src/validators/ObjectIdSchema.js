const { z } = require("zod");

const objectIdSchema = z
  .string()
  .regex(
    /^[a-fA-F0-9]{24}$/,
    "Invalid ObjectId"
  );

module.exports = objectIdSchema;