const conversationRepository = require("../repositories/conversation.repository");
const AppError = require("../utils/appError");

async function createConversationService(myId, otherUserId) {
  if (myId === otherUserId) {
    throw new AppError(
      "You cannot start a conversation with yourself.",
      400,
      "ValidationError",
    );
  }

  let conversation =
    await conversationRepository.findConversationBetweenUsers(
      myId,
      otherUserId,
    );

  if (conversation) {
    return conversation;
  }

  conversation =
    await conversationRepository.createConversation(
      myId,
      otherUserId,
    );

  return conversation;
}

async function getMyConversationsService(userId) {
  return await conversationRepository.getMyConversations(
    userId,
  );
}

async function verifyConversationParticipant(
  conversationId,
  userId,
  markAsRead = false,
) {
  const conversation =
    await conversationRepository.findConversationById(
      conversationId,
      userId,
    );

  if (!conversation) {
    throw new AppError(
      "Conversation not found.",
      404,
      "NotFoundError",
    );
  }

  if (markAsRead) {
    await conversationRepository.markConversationAsRead(
      conversationId,
      userId,
    );
  }

  return conversation;
}

module.exports = {
  createConversationService,
  getMyConversationsService,
  verifyConversationParticipant,
};