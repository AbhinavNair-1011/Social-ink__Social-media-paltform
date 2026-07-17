const Conversation = require("../models/converstation.model");
const AppError = require("../utils/AppError");

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
  });

  return conversation;
}

async function getMyConversationsService(userId) {
  return Conversation.find({
    participants: userId,
  })
    .populate(
      "participants",
      "name username profileImage",
    )
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
}

async function verifyConversationParticipant(
  conversationId,
  userId,
) {
  const conversation = await Conversation.findOne({
    _id: conversationId,
    participants: userId,
  });

  if (!conversation) {
    throw new AppError(
      "Conversation not found.",
      404,
      "NotFoundError",
    );
  }

  return conversation;
}

module.exports = {
  createConversationService,
  getMyConversationsService,
  verifyConversationParticipant,
};