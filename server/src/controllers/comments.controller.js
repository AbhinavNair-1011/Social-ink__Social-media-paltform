const commentRepository = require("../repositories/comment.repository");
const postRepository = require("../repositories/post.repository");
const { createNotification } = require("../services/notification.service");
const { deleteNotification } = require("../services/notification.service");
const getPostRealtimeData = require("../services/post.service");
const { getIO } = require("../socket");
const AppError = require("../utils/appError");

async function createComment(req, res) {
  const { postId } = req.params;

  const post = await postRepository.findOwner(postId);

  if (!post) {
    throw new AppError("Post not found", 404, "NotFoundError");
  }

  const comment = await commentRepository.createComment({
    userId: req.user.userId,
    postId,
    content: req.body.content,
  });

  await commentRepository.incrementCommentsCount(postId);

  await createNotification({
    receiver: post.authorId,
    sender: req.user.userId,
    type: "comment",
    post: post.postId,
    comment: comment._id,
  });

  const updatedPost = await getPostRealtimeData(postId);

  const populatedComment = await commentRepository.findById(comment.id);

  populatedComment.isOwner =
    populatedComment.userId._id === req.user.userId;

  getIO().emit("comment:created", populatedComment);

  getIO().emit("post:updated", updatedPost);

  return res.status(201).json({
    success: true,
    data: {
      comment,
    },
    error: null,
  });
}

async function getComments(req, res) {
  const { postId } = req.params;

  const post = await postRepository.findOwner(postId);

  if (!post) {
    throw new AppError("Post not found", 404, "NotFoundError");
  }

  const comments = await commentRepository.getComments(
    postId,
    req.user.userId,
  );

  return res.status(200).json({
    success: true,
    data: {
      comments,
    },
    error: null,
  });
}

async function updateComment(req, res) {
  const { commentId } = req.params;

  const comment = await commentRepository.findById(commentId);

  if (!comment) {
    throw new AppError("Comment not found", 404, "NotFoundError");
  }

  if (comment.userId._id !== req.user.userId) {
    throw new AppError(
      "You are not authorized to update this comment",
      403,
      "AuthorizationError",
    );
  }

  const updatedComment = await commentRepository.updateComment(
    commentId,
    req.user.userId,
    req.body.content,
  );

  return res.status(200).json({
    success: true,
    data: {
      comment: updatedComment,
    },
    error: null,
  });
}

async function deleteComment(req, res) {
  const { commentId } = req.params;

  const comment = await commentRepository.findById(commentId);

  if (!comment) {
    throw new AppError("Comment not found", 404, "NotFoundError");
  }

  if (comment.userId._id !== req.user.userId) {
    throw new AppError(
      "You are not authorized to delete this comment",
      403,
      "AuthorizationError",
    );
  }

  await commentRepository.decrementCommentsCount(comment.postId);

  await commentRepository.deleteComment(
    commentId,
    req.user.userId,
  );

  await deleteNotification({
    receiver: comment.postOwnerId,
    sender: req.user.userId,
    type: "comment",
    post: comment.postId,
    comment: comment._id,
  });

  const updatedPost = await getPostRealtimeData(comment.postId);

  getIO().emit("post:updated", updatedPost);

  return res.status(200).json({
    success: true,
    data: null,
    error: null,
  });
}
module.exports = {
  createComment,
  getComments,
  updateComment,
  deleteComment,
};
