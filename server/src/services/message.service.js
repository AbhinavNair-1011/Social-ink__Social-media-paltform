const messageRepository = require("../repositories/message.repository");
const conversationRepository = require("../repositories/conversation.repository");

const { verifyConversationParticipant } = require("./conversation.service");

const { emitUnreadCountUpdated } = require("../socket");

async function getMessagesService(conversationId, userId) {
  await verifyConversationParticipant(conversationId, userId, true);

  return await messageRepository.getMessages(conversationId);
}

async function createMessageService(conversationId, senderId, text, imageUrl) {
  await verifyConversationParticipant(conversationId, senderId);

  const message = await messageRepository.createMessage({
    conversationId,
    senderId,
    text,
    imageUrl,
  });

  await conversationRepository.updateLastMessage(
    conversationId,
    message._id,
    message.createdAt,
  );

  const unreadUsers = await conversationRepository.incrementUnreadCount(
    conversationId,
    senderId,
  );

  unreadUsers.forEach((userId) => {
    emitUnreadCountUpdated(userId);
  });

  return await messageRepository.findMessageById(message._id);
}

module.exports = {
  getMessagesService,
  createMessageService,
};
