const Conversation = require("../models/converstation.model");
const Message = require("../models/message.model");

const {
  verifyConversationParticipant,
} = require("./conversation.service");

async function getMessagesService(
  conversationId,
  userId,
) {
  await verifyConversationParticipant(
    conversationId,
    userId,
  );

  return Message.find({
    conversation: conversationId,
  })
    .populate(
      "sender",
      "name username profileImage",
    )
    .sort({
      createdAt: 1,
    });
}

async function createMessageService(
  conversationId,
  senderId,
  text,
  imageUrl,
) {
  await verifyConversationParticipant(
    conversationId,
    senderId,
  );

  const message = await Message.create({
    conversation: conversationId,
    sender: senderId,
    text,
    imageUrl,
    seenBy: [senderId],
  });

  await Conversation.findByIdAndUpdate(
    conversationId,
    {
      lastMessage: message._id,
      lastMessageAt: message.createdAt,
    },
  );

  return Message.findById(message._id).populate(
    "sender",
    "name username profileImage",
  );
}

module.exports = {
  getMessagesService,
  createMessageService,
};