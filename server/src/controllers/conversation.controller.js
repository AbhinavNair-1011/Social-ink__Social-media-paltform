const {
  createConversationService,
  getMyConversationsService,
} = require("../services/conversation.service");

async function createConversation(req, res) {
  const conversation = await createConversationService(
    req.user.userId,
    req.body.userId,
  );

  return res.status(201).json({
    status: "success",
    data: {
      conversation,
    },
  });
}

async function getMyConversations(req, res) {
  const conversations = await getMyConversationsService(req.user.userId);

  return res.status(200).json({
    status: "success",
    data: {
      conversations,
    },
  });
}

module.exports = {
  createConversation,
  getMyConversations,
};
