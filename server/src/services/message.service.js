const Conversation = require("../models/converstation.model");
const Message = require("../models/message.model");

const { verifyConversationParticipant } = require("./conversation.service");

const { emitUnreadCountUpdated } = require("../socket");

async function getMessagesService(conversationId, userId) {
  await verifyConversationParticipant(conversationId, userId, true);

  return Message.find({
    conversation: conversationId,
  })
    .populate("sender", "name username profileImage")
    .sort({
      createdAt: 1,
    });
}

async function createMessageService(conversationId, senderId, text, imageUrl) {
  const conversation = await verifyConversationParticipant(
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

  conversation.lastMessage = message._id;
  conversation.lastMessageAt = message.createdAt;

  conversation.participants.forEach((participant) => {
    const participantId = participant.toString();

    if (participantId === senderId.toString()) {
      return;
    }

    const currentUnread = conversation.unreadCounts.get(participantId) || 0;

    conversation.unreadCounts.set(participantId, currentUnread + 1);

    emitUnreadCountUpdated(participantId);
  });

  await conversation.save();

  return Message.findById(message._id).populate(
    "sender",
    "name username profileImage",
  );
}

module.exports = {
  getMessagesService,
  createMessageService,
};
