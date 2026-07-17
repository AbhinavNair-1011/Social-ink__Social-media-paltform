const router = require("express").Router();

const {
  getMyConversations,
  createConversation,
  getUnreadConversationCount,
} = require("../controllers/conversation.controller");

const validate = require("../middlewares/validate");
const authMiddleware = require("../middlewares/auth");

const {
  createConversationSchema,
} = require("../validators/conversation.validation");

router.get("/", authMiddleware, getMyConversations);

router.get("/unread-count", authMiddleware, getUnreadConversationCount);

router.post(
  "/",
  authMiddleware,
  validate(createConversationSchema),
  createConversation,
);

module.exports = router;
