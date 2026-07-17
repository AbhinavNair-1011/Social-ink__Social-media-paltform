import api from "../../../app/api/axios";

export async function getMyConversations() {
  const response = await api.get("/conversations");

  return response.data.data.conversations;
}

export async function createConversation(userId) {
  const response = await api.post("/conversations", {
    userId,
  });

  return response.data.data.conversation;
}

export async function getUnreadConversationCount() {
  const response = await api.get("/conversations/unread-count");

  return response.data.data.unreadCount;
}
