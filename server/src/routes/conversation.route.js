const router = require("express").Router();

const {
  getMyConversations,
  createConversation,
} = require("../controllers/conversation.controller");

const validate = require("../middlewares/validate");
const authMiddleware = require("../middlewares/auth");

const { createConversationSchema } = require("../validators/conversation.validation");



router.get("/", authMiddleware,getMyConversations)

router.post("/",authMiddleware,validate(createConversationSchema), createConversation);

module.exports = router;
