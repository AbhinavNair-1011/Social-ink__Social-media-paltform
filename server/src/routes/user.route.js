const express = require("express");
const authMiddleware = require("../middlewares/auth");

const validate = require("../middlewares/validate");

const {
  updateProfileSchema,
  userIdSchema,
  searchUserSchema,
} = require("../validators/user.validation");

const {
  getMyProfile,
  updateMyProfile,
  getUserProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  searchUsers,
  uploadProfileImage,
} = require("../controllers/user.controller");
const upload = require("../middlewares/upload");

const router = express.Router();

router.get("/me", authMiddleware, getMyProfile);

router.patch(
  "/me",
  authMiddleware,
  validate(updateProfileSchema),
  updateMyProfile,
);
router.patch(
  "/me/profile-image",
  authMiddleware,
  upload.single("profileImage"),
  uploadProfileImage,
);
router.get(
  "/search",
  authMiddleware,
  validate(searchUserSchema, "query"),
  searchUsers,
);

router.get(
  "/:userId",
  authMiddleware,
  validate(userIdSchema, "params"),
  getUserProfile,
);

router.post(
  "/:userId/follow",
  authMiddleware,
  validate(userIdSchema, "params"),
  followUser,
);

router.delete(
  "/:userId/follow",
  authMiddleware,
  validate(userIdSchema, "params"),
  unfollowUser,
);

router.get(
  "/:userId/followers",
  authMiddleware,
  validate(userIdSchema, "params"),
  getFollowers,
);

router.get(
  "/:userId/following",
  authMiddleware,
  validate(userIdSchema, "params"),
  getFollowing,
);
module.exports = router;
