const {
  createConversationService,
  getMyConversationsService,
} = require("../services/conversation.service");

const Conversation = require("../models/converstation.model");

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
  const conversations =
    await getMyConversationsService(req.user.userId);

  return res.status(200).json({
    status: "success",
    data: {
      conversations,
    },
  });
}

async function getUnreadConversationCount(req, res) {
  const conversations = await Conversation.find({
    participants: req.user.userId,
  }).select("unreadCounts");

  const unreadCount = conversations.filter(
    (conversation) =>
      (conversation.unreadCounts?.get(
        req.user.userId.toString(),
      ) || 0) > 0,
  ).length;

  return res.status(200).json({
    status: "success",
    data: {
      unreadCount,
    },
  });
}

module.exports = {
  createConversation,
  getMyConversations,
  getUnreadConversationCount,
};