  const likeRepository = require("../repositories/like.repository");
  const postRepository = require("../repositories/post.repository");
  const { createNotification } = require("../services/notification.service");
  const AppError = require("../utils/appError");
  const uploadToS3 = require("../utils/uploadToS3");
  const { deleteNotification } = require("../services/notification.service");
  const { getIO } = require("../socket");
  const getPostRealtimeData = require("../services/post.service");


async function createPost(req, res) {
  let image = "";

  if (req.file) {
    image = await uploadToS3(req.file);
  }

  if (!req.body.content && !image) {
    throw new AppError(
      "Post must contain text or image.",
      400,
      "ValidationError",
    );
  }

  const post = await postRepository.createPost({
    authorId: req.user.userId,
    content: req.body.content,
    imageUrl: image,
  });

  return res.status(201).json({
    success: true,
    data: {
      post,
    },
    error: null,
  });
}

async function getPosts(req, res) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const totalPosts = await postRepository.countPosts();

  const posts = await postRepository.getFeed({
    userId: req.user.userId,
    page,
    limit,
  });

  return res.status(200).json({
    success: true,
    data: {
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
    },
    error: null,
  });
}
async function getPostById(req, res) {
  const { postId } = req.params;

  const post = await postRepository.getPostById({
    postId,
    userId: req.user.userId,
  });

  if (!post) {
    throw new AppError("Post not found", 404, "NotFoundError");
  }

  return res.status(200).json({
    success: true,
    data: {
      post,
    },
    error: null,
  });
}

async function updatePost(req, res) {
  const { postId } = req.params;

  const post = await postRepository.findOwner(postId);

  if (!post) {
    throw new AppError("Post not found", 404, "NotFoundError");
  }

  if (post.authorId !== req.user.userId) {
    throw new AppError(
      "You are not authorized to update this post",
      403,
      "AuthorizationError",
    );
  }

  const updatedPost = await postRepository.updatePost({
    postId,
    userId: req.user.userId,
    content: req.body.content,
  });

  return res.status(200).json({
    success: true,
    data: {
      post: updatedPost,
    },
    error: null,
  });
}

 async function deletePost(req, res) {
  const { postId } = req.params;

  const post = await postRepository.findOwner(postId);

  if (!post) {
    throw new AppError("Post not found", 404, "NotFoundError");
  }

  if (post.authorId !== req.user.userId) {
    throw new AppError(
      "You are not authorized to delete this post",
      403,
      "AuthorizationError",
    );
  }

  await postRepository.deletePost({
    postId,
    userId: req.user.userId,
  });

  getIO().emit("post:deleted", postId);

  return res.status(200).json({
    success: true,
    data: null,
    error: null,
  });
}

async function likePost(req, res) {
  const { postId } = req.params;

  const post = await postRepository.findOwner(postId);

  if (!post) {
    throw new AppError("Post not found", 404, "NotFoundError");
  }

  const alreadyLiked = await likeRepository.isLiked(
    req.user.userId,
    postId,
  );

  if (alreadyLiked) {
    throw new AppError("Post already liked", 409, "ConflictError");
  }

  await likeRepository.likePost(
    req.user.userId,
    postId,
  );

  await createNotification({
    receiver: post.authorId,
    sender: req.user.userId,
    type: "like",
    post: post.postId,
  });

  const updatedPost = await getPostRealtimeData(
    postId,
    req.user.userId,
  );

  getIO().emit("post:updated", updatedPost);

  return res.status(201).json({
    success: true,
    data: null,
    error: null,
  });
}

async function unlikePost(req, res) {
  const { postId } = req.params;

  const post = await postRepository.findOwner(postId);

  if (!post) {
    throw new AppError("Post not found", 404, "NotFoundError");
  }

  const alreadyLiked = await likeRepository.isLiked(
    req.user.userId,
    postId,
  );

  if (!alreadyLiked) {
    throw new AppError(
      "Like not found",
      404,
      "NotFoundError",
    );
  }

  await likeRepository.unlikePost(
    req.user.userId,
    postId,
  );

  await deleteNotification({
    receiver: post.authorId,
    sender: req.user.userId,
    type: "like",
    post: post.postId,
  });

  const updatedPost = await getPostRealtimeData(postId);

  getIO().emit("post:updated", updatedPost);

  return res.status(200).json({
    success: true,
    data: null,
    error: null,
  });
}
async function getMyPosts(req, res) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const type = req.query.type || "all";

  const totalPosts = await postRepository.countUserPosts(
    req.user.userId,
    type,
  );

  const posts = await postRepository.getMyPosts({
    userId: req.user.userId,
    page,
    limit,
    type,
  });

  return res.status(200).json({
    success: true,
    data: {
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
    },
    error: null,
  });
}
async function getUserPosts(req, res) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const type = req.query.type || "all";

  const totalPosts = await postRepository.countUserPosts(
    req.params.userId,
    type,
  );

  const posts = await postRepository.getUserPosts({
    profileUserId: req.params.userId,
    currentUserId: req.user.userId,
    page,
    limit,
    type,
  });

  return res.status(200).json({
    success: true,
    data: {
      posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
    },
    error: null,
  });
}
 module.exports={
  createPost,
      getPosts,
    getPostById,
    updatePost,
    deletePost,
    likePost,
    unlikePost,
    getUserPosts,
    getMyPosts
    
  };
