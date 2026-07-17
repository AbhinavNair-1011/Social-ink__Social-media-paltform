const express = require("express");

const router = express.Router();
const { getNotifications, getUnreadCount, markAllAsRead, markAsRead } = require("../controllers/notification.controller");
const authMiddleware = require("../middlewares/auth");
const validate = require("../middlewares/validate")
const { postIdSchema } = require("../validators/post.validation");
const { notificationIdSchema } = require("../validators/notification.validation");


router.get("/", authMiddleware, getNotifications);

router.get("/unread-count", authMiddleware, getUnreadCount);

router.patch("/read-all", authMiddleware, markAllAsRead);

router.patch(
  "/:notificationId/read",
  authMiddleware,  markAsRead );

module.exports= router