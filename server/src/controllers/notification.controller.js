const notificationRepository = require("../repositories/notification.repository");


async function getNotifications(req, res) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const totalNotifications =
    await notificationRepository.countNotifications(
      req.user.userId,
    );

  const notifications =
    await notificationRepository.getNotifications(
      req.user.userId,
      page,
      limit,
    );

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
  const notification =
    await notificationRepository.markAsRead(
      req.params.notificationId,
      req.user.userId,
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
  await notificationRepository.markAllAsRead(
    req.user.userId,
  );

  return res.status(200).json({
    success: true,
    data: null,
    error: null,
  });
}

async function getUnreadCount(req, res) {
  const unreadCount =
    await notificationRepository.countUnreadNotifications(
      req.user.userId,
    );

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