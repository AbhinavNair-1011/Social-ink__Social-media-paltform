const router = require("express").Router();

const {
  createMessage,
  getMessages,
} = require("../controllers/message.controller");

const validate = require("../middlewares/validate");
const authMiddleware = require("../middlewares/auth");

const { createMessageSchema } = require("../validators/message.validation");

router.get("/:conversationId", authMiddleware, getMessages);

router.post("/", authMiddleware, validate(createMessageSchema), createMessage);

module.exports = router;
