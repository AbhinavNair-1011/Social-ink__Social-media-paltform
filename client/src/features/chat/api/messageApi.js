import api from "../../../app/api/axios"

export async function getMessages(conversationId) {
  const response = await api.get(
    `/messages/${conversationId}`,
  );

  return response.data.data.messages;
}

export async function createMessage({
  conversationId,
  text,
  imageUrl,
}) {
  const response = await api.post("/messages", {
    conversationId,
    text,
    imageUrl,
  });

  return response.data.data.message;
}