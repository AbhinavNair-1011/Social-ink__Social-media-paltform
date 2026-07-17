const Notification = require("../models/notification.model");

async function getNotifications(req, res) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const skip = (page - 1) * limit;

  const totalNotifications = await Notification.countDocuments({
    receiver: req.user.userId,
  });

  const notifications = await Notification.find({
    receiver: req.user.userId,
  })
    .populate("sender", "name userName profileImage createdAt")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return res.status(200).json({
    success: true,
    data: {
      notifications,
      currentPage: page,
      totalPages: Math.ceil(totalNotifications / limit),
      totalNotifications,
    },
    error: null,
  });
}

async function markAsRead(req, res) {
  const notification = await Notification.findOneAndUpdate(
    {
      _id: req.params.notificationId,
      receiver: req.user.userId,
    },
    {
      isRead: true,
    },
    {
      new: true,
    },
  );

  return res.status(200).json({
    success: true,
    data: {
      notification,
    },
    error: null,
  });
}
async function markAllAsRead(req, res) {
  await Notification.updateMany(
    {
      receiver: req.user.userId,
      isRead: false,
    },
    {
      isRead: true,
    },
  );

  return res.status(200).json({
    success: true,
    data: null,
    error: null,
  });
}
async function getUnreadCount(req, res) {
  const unreadCount = await Notification.countDocuments({
    receiver: req.user.userId,
    isRead: false,
  });

  return res.status(200).json({
    success: true,
    data: {
      unreadCount,
    },
    error: null,
  });
}

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
};
