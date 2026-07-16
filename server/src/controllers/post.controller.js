const Like = require("../models/like.model");
const Post = require("../models/post.model");
const AppError = require("../utils/AppError");
const uploadToS3 = require("../utils/uploadToS3");

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

  const post = await Post.create({
    author: req.user.userId,
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

  const skip = (page - 1) * limit;

  const totalPosts = await Post.countDocuments();

  const posts = await Post.find()
    .populate("author", "name userName profileImage")
    .sort({
      createdAt: -1,
    })
    .skip(skip)
    .limit(limit);

  const likes = await Like.find({
    userId: req.user.userId,
  }).select("postId");

  const likedPostIds = likes.map((like) => like.postId.toString());

  const formattedPosts = posts.map((post) => ({
    ...post.toObject(),

    isLikedByMe: likedPostIds.includes(post._id.toString()),

    isOwner: post.author._id.toString() === req.user.userId,
  }));

  return res.status(200).json({
    success: true,
    data: {
      posts: formattedPosts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
    },
    error: null,
  });
}
async function getPostById(req, res) {
  const { postId } = req.params;

  const post = await Post.findById(postId).populate(
    "author",
    "name userName profileImage",
  );

  if (!post) {
    throw new AppError("Post not found", 404, "NotFoundError");
  }
  const like = await Like.findOne({
    userId: req.user.userId,
    postId: post._id,
  });

  const isLikedByMe = like ? true : false;

  const isOwner = post.author._id.toString() === req.user.userId;

  return res.status(200).json({
    success: true,
    data: {
      post: {
        ...post.toObject(),
        isLikedByMe,
        isOwner,
      },
    },
    error: null,
  });
}

async function updatePost(req, res) {
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError("Post not found", 404, "NotFoundError");
  }

  if (post.author.toString() !== req.user.userId) {
    throw new AppError(
      "You are not authorized to update this post",
      403,
      "AuthorizationError",
    );
  }

  post.content = req.body.content;

  await post.save();

  return res.status(200).json({
    success: true,
    data: {
      post,
    },
    error: null,
  });
}

async function deletePost(req, res) {
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError("Post not found", 404, "NotFoundError");
  }

  if (post.author.toString() !== req.user.userId) {
    throw new AppError(
      "You are not authorized to delete this post",
      403,
      "AuthorizationError",
    );
  }

  await post.deleteOne();

  return res.status(200).json({
    success: true,
    data: null,
    error: null,
  });
}

async function likePost(req, res) {
  const { postId } = req.params;

  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError("Post not found", 404, "NotFoundError");
  }

  const existingLike = await Like.findOne({
    userId: req.user.userId,
    postId,
  });

  if (existingLike) {
    throw new AppError("Post already liked", 409, "ConflictError");
  }

  await Like.create({
    userId: req.user.userId,
    postId,
  });

  post.likesCount += 1;

  await post.save();

  return res.status(201).json({
    success: true,
    data: null,
    error: null,
  });
}

async function unlikePost(req, res) {
  const { postId } = req.params;

  const like = await Like.findOne({
    userId: req.user.userId,
    postId,
  });

  if (!like) {
    throw new AppError("Like not found", 404, "NotFoundError");
  }

  await like.deleteOne();

  await Post.findByIdAndUpdate(postId, {
    $inc: {
      likesCount: -1,
    },
  });

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

  const skip = (page - 1) * limit;

  const filter = {
    author: req.user.userId,
  };
  if (type === "images") {
    filter.imageUrl = {
      $exists: true,
      $ne: "",
    };
  }

  if (type === "text") {
    filter.$or = [
      { imageUrl: { $exists: false } },
      { imageUrl: null },
      { imageUrl: "" },
    ];
  }

  const totalPosts = await Post.countDocuments(filter);

  const posts = await Post.find(filter)
    .populate("author", "name userName profileImage")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const likes = await Like.find({
    userId: req.user.userId,
  }).select("postId");

  const likedPostIds = likes.map((like) => like.postId.toString());

  const formattedPosts = posts.map((post) => ({
    ...post.toObject(),
    isOwner: true,
    isLikedByMe: likedPostIds.includes(post._id.toString()),
  }));

  return res.status(200).json({
    success: true,
    data: {
      posts: formattedPosts,
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

  const skip = (page - 1) * limit;

const filter = {
  author: req.params.userId,
};
  if (type === "images") {
    filter.imageUrl = {
      $exists: true,
      $ne: "",
    };
  }

  if (type === "text") {
    filter.$or = [
      { imageUrl: { $exists: false } },
      { imageUrl: null },
      { imageUrl: "" },
    ];
  }

  const totalPosts = await Post.countDocuments({
    author: req.params.userId,
  });

  const posts = await Post.find(filter)
    .populate("author", "name userName profileImage")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const likes = await Like.find({
    userId: req.user.userId,
  }).select("postId");

  const likedPostIds = likes.map((like) => like.postId.toString());

  const formattedPosts = posts.map((post) => ({
    ...post.toObject(),

    isOwner: post.author._id.toString() === req.user.userId,

    isLikedByMe: likedPostIds.includes(post._id.toString()),
  }));

  return res.status(200).json({
    success: true,
    data: {
      posts: formattedPosts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
    },
    error: null,
  });
}
module.exports = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  getUserPosts,
  getMyPosts,
};
