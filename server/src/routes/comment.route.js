const express = require("express");

const router = express.Router();
const { createComment, getComments, updateComment, deleteComment } = require("../controllers/comments.controller");
const authMiddleware = require("../middlewares/auth");
const  validate  = require("../middlewares/validate");
const { commentIdSchema, updateCommentSchema, createCommentSchema } = require("../validators/comment.validation");
const { postIdSchema } = require("../validators/post.validation");

router.post(
  "/:postId/comments",
  authMiddleware,
  validate(postIdSchema, "params"),
  validate(createCommentSchema),
  createComment
);

router.get(
  "/:postId/comments",
  authMiddleware,
  validate(postIdSchema, "params"),
  getComments
);

router.patch(
  "/comments/:commentId",
  authMiddleware,
  validate(commentIdSchema, "params"),
  validate(updateCommentSchema),
  updateComment
);

router.delete(
  "/comments/:commentId",
  authMiddleware,
  validate(commentIdSchema, "params"),
  deleteComment
);

module.exports=router