const express = require("express");

const router = express.Router();

const authMiddleware = require("../middlewares/auth");
const validate = require("../middlewares/validate");

const {
  createPostSchema,
  getPostsSchema,
  postIdSchema,
  updatePostSchema,
} = require("../validators/post.validation");

const {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  getPostById,
  unlikePost,
  likePost,
} = require("../controllers/post.controller");

router.get("/", authMiddleware, validate(getPostsSchema, "query"), getPosts);

router.post("/", authMiddleware, validate(createPostSchema), createPost);

router.get(
  "/:postId",
  authMiddleware,
  validate(postIdSchema, "params"),
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
