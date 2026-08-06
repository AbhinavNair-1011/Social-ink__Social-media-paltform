const notificationRepository = require("../repositories/notification.repository");
const userRepository = require("../repositories/user.repository");

const { getIO } = require("../socket");

async function createNotification({
  receiver,
  sender,
  type,
  post = null,
  comment = null,
}) {
  if (receiver === sender) {
    return;
  }

  const existingNotification =
    await notificationRepository.findNotification({
      receiver,
      sender,
      type,
      post,
      comment,
    });

  if (existingNotification) {
    return existingNotification;
  }

  const notification =
    await notificationRepository.createNotification({
      receiver,
      sender,
      type,
      post,
      comment,
    });

  const senderUser = await userRepository.findPublicById(sender);

  notification.sender = {
    _id: senderUser.id,
    name: senderUser.name,
    userName: senderUser.userName,
    profileImage: senderUser.profileImage,
  };

  getIO().to(receiver).emit("notification:new", notification);

  return notification;
}

async function deleteNotification({
  receiver,
  sender,
  type,
  post = null,
  comment = null,
}) {
  const notificationId =
    await notificationRepository.deleteNotification({
      receiver,
      sender,
      type,
      post,
      comment,
    });

  if (!notificationId) return;

  getIO().to(receiver).emit(
    "notification:delete",
    notificationId,
  );
}

module.exports = {
  createNotification,
  deleteNotification,
};