const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const upload = require("../middlewares/upload");
const {
  createPostSchema,
  getPostsSchema,
  postIdSchema,
  updatePostSchema,
} = require("../validators/post.validation");

const {userIdSchema} = require("../validators/user.validation")
const {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  getPostById,
  unlikePost,
  likePost,
  getMyPosts,
  getUserPosts,
} = require("../controllers/post.controller");
const objectIdSchema = require("../validators/objectIdSchema");

router.get("/", authMiddleware, validate(getPostsSchema, "query"), getPosts);

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  validate(createPostSchema),
  createPost,
);
router.get("/me/posts", authMiddleware, getMyPosts);

router.get(
  "/:postId",
  authMiddleware,
  getPostById,
);

router.patch(
  "/:postId",
  authMiddleware,
  validate(postIdSchema, "params"),
  validate(updatePostSchema),
  updatePost,
);

router.delete(
  "/:postId",
  authMiddleware,
  validate(postIdSchema, "params"),
  deletePost,
);
router.get(
  "/:userId/posts",
  authMiddleware,
  validate(userIdSchema, "params"),
  getUserPosts,
);
router.post(
  "/:postId/like",
  authMiddleware,
  validate(postIdSchema, "params"),
  likePost,
);

router.delete(
  "/:postId/like",
  authMiddleware,
  validate(postIdSchema, "params"),
  unlikePost,
);

module.exports = router;
