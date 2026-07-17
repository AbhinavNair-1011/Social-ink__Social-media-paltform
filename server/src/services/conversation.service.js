const Conversation = require("../models/converstation.model");
const AppError = require("../utils/appError");

async function createConversationService(myId, otherUserId) {
  if (myId === otherUserId) {
    throw new AppError(
      "You cannot start a conversation with yourself.",
      400,
      "ValidationError",
    );
  }

  let conversation = await Conversation.findOne({
    participants: {
      $all: [myId, otherUserId],
    },
    $expr: {
      $eq: [{ $size: "$participants" }, 2],
    },
  });

  if (conversation) {
    return conversation;
  }

  conversation = await Conversation.create({
    participants: [myId, otherUserId],
    unreadCounts: {
      [myId]: 0,
      [otherUserId]: 0,
    },
  });

  return conversation;
}

async function getMyConversationsService(userId) {
  const conversations = await Conversation.find({
    participants: userId,
  })
    .populate("participants", "name username profileImage")
    .populate({
      path: "lastMessage",
      populate: {
        path: "sender",
        select: "name username profileImage",
      },
    })
    .sort({
      lastMessageAt: -1,
    });

  return conversations.map((conversation) => ({
    ...conversation.toObject(),
    unreadCount: conversation.unreadCounts?.get(userId.toString()) || 0,
  }));
}

async function verifyConversationParticipant(
  conversationId,
  userId,
  markAsRead = false,
) {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId,
  });

  if (!conversation) {
    throw new AppError("Conversation not found.", 404, "NotFoundError");
  }

  if (markAsRead) {
    await Conversation.updateOne(
      {
        _id: conversationId,
        participants: userId,
      },
      {
        $set: {
          [`unreadCounts.${userId}`]: 0,
        },
      },
    );
  }

  return conversation;
}

module.exports = {
  createConversationService,
  getMyConversationsService,
  verifyConversationParticipant,
};
