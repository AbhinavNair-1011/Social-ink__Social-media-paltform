const Notification = require("../models/notification.model");

const { getIO } = require("../socket");

async function createNotification({
  receiver,
  sender,
  type,
  post = null,
  comment = null,
}) {
  if (receiver.toString() === sender.toString()) {
    return;
  }

  const existingNotification = await Notification.findOne({
    receiver,
    sender,
    type,
    post,
    comment,
  });

  if (existingNotification) {
    return existingNotification;
  }

  const notification = await Notification.create({
    receiver,
    sender,
    type,
    post,
    comment,
  });

  await notification.populate("sender", "name userName profileImage");

  getIO().to(receiver.toString()).emit("notification:new", notification);

  return notification;
}


async function deleteNotification({
  receiver,
  sender,
  type,
  post = null,
  comment = null,
}) {
  const notification = await Notification.findOneAndDelete({
    receiver,
    sender,
    type,
    post,
    comment,
  });

  if (!notification) return;

  getIO().to(receiver.toString()).emit("notification:delete", notification._id);
}

module.exports = {
  createNotification,
  deleteNotification,
};
