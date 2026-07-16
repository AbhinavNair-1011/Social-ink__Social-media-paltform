const Comment = require("../models/comment.model");
const Post = require("../models/post.model");

const AppError = require("../utils/appError");

async function createComment(req, res) {
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(
      "Post not found",
      404,
      "NotFoundError"
    );
  }

  const comment = await Comment.create({
    userId: req.user.userId,
    postId,
    content: req.body.content,
  });

  post.commentsCount += 1;

  await post.save();

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

  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(
      "Post not found",
      404,
      "NotFoundError"
    );
  }

  const comments = await Comment.find({
    postId,
  })
    .populate(
      "userId",
      "name userName profileImage"
    )
    .sort({
      createdAt: -1,
    });
      const formattedComments = comments.map(
    (comment) => ({
      ...comment.toObject(),

      isOwner:
        comment.userId._id.toString() ===
        req.user.userId,
    })
  );
  return res.status(200).json({
    success: true,

    data: {
      comments:formattedComments,
    },

    error: null,
  });
}

async function updateComment(req, res) {
  const { commentId } = req.params;

  const comment =
    await Comment.findById(commentId);

  if (!comment) {
    throw new AppError(
      "Comment not found",
      404,
      "NotFoundError"
    );
  }

  if (
    comment.userId.toString() !==
    req.user.userId
  ) {
    throw new AppError(
      "You are not authorized to update this comment",
      403,
      "AuthorizationError"
    );
  }

  comment.content = req.body.content;

  await comment.save();

  return res.status(200).json({
    success: true,

    data: {
      comment,
    },

    error: null,
  });
}

async function deleteComment(req, res) {
  const { commentId } = req.params;

  const comment =
    await Comment.findById(commentId);

  if (!comment) {
    throw new AppError(
      "Comment not found",
      404,
      "NotFoundError"
    );
  }

  if (
    comment.userId.toString() !==
    req.user.userId
  ) {
    throw new AppError(
      "You are not authorized to delete this comment",
      403,
      "AuthorizationError"
    );
  }

  const post = await Post.findById(
    comment.postId
  );

  if (post) {
    post.commentsCount -= 1;

    await post.save();
  }

  await comment.deleteOne();

  return res.status(200).json({
    success: true,
    data: null,
    error: null,
  });
}
module.exports={
    createComment,
    getComments,
    updateComment,
    deleteComment
}