const {
  createMessageService,
  getMessagesService,
} = require("../services/message.service");

const { emitNewMessage } = require("../socket/index");

async function getMessages(req, res) {
  const messages = await getMessagesService(
    req.params.conversationId,
    req.user.userId,
  );

  return res.status(200).json({
    status: "success",
    data: {
      messages,
    },
  });
}

async function createMessage(req, res) {
  const { conversationId, text, imageUrl } = req.body;

  const message = await createMessageService(
    conversationId,
    req.user.userId,
    text,
    imageUrl,
  );

  emitNewMessage(conversationId, message);
  return res.status(201).json({
    status: "success",
    data: {
      message,
    },
  });
}

module.exports = {
  createMessage,
  getMessages,
};
