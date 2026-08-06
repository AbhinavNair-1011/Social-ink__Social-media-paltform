const userRepository = require("../repositories/user.repository");
const AppError = require("../utils/appError");
const followRepository = require("../repositories/follow.repository");
const postRepository = require("../repositories/post.repository");
const uploadToS3 = require("../utils/uploadToS3");
const { createNotification, deleteNotification } = require("../services/notification.service");

async function getMyProfile(req, res) {
  const user = await userRepository.findProfileById(req.user.userId);

  if (!user) {
    throw new AppError("User not found", 404, "NotFoundError");
  }

  const postsCount = await postRepository.countPostsByAuthor(
    req.user.userId,
  );

  const followersCount = await followRepository.countFollowers(
    req.user.userId,
  );

  const followingCount = await followRepository.countFollowing(
    req.user.userId,
  );

  return res.status(200).json({
    success: true,
    data: {
      user,
      postsCount,
      followersCount,
      followingCount,
    },
    error: null,
  });
}

async function updateMyProfile(req, res) {
  console.log(req.body)
  const updatedUser = await userRepository.updateUser(
    req.user.userId,
    req.body,
  );

  if (!updatedUser) {
    throw new AppError("User not found", 404, "NotFoundError");
  }

  const postsCount = await postRepository.countPostsByAuthor(
    req.user.userId,
  );

  const followersCount = await followRepository.countFollowers(
    req.user.userId,
  );

  const followingCount = await followRepository.countFollowing(
    req.user.userId,
  );

  return res.status(200).json({
    success: true,
    data: {
      user: updatedUser,
      postsCount,
      followersCount,
      followingCount,
    },
    error: null,
  });
}
async function getUserProfile(req, res) {
  const { userId } = req.params;

  const user = await userRepository.findPublicById(userId);
console.log(userId)
  if (!user) {
    throw new AppError("User not found", 404, "NotFoundError");
  }

  const postsCount = await postRepository.countPostsByAuthor(userId);

  const followersCount = await followRepository.countFollowers(userId);

  const followingCount = await followRepository.countFollowing(userId);

  const isFollowing = await followRepository.isFollowing(
    req.user.userId,
    userId,
  );
console.log(user)
  const isMe = user.id === req.user.userId;

  return res.status(200).json({
    success: true,
    data: {
      user,
      postsCount,
      followersCount,
      followingCount,
      isFollowing,
      isMe,
    },
    error: null,
  });
}
async function followUser(req, res) {
  const { userId } = req.params;

  if (userId === req.user.userId) {
    throw new AppError("You cannot follow yourself", 400, "ValidationError");
  }

  const user = await userRepository.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404, "NotFoundError");
  }

  await followRepository.followUser(req.user.userId, userId);

  await createNotification({
    receiver: userId,
    sender: req.user.userId,
    type: "follow",
  });

  return res.status(201).json({
    success: true,
    data: null,
    error: null,
  });
}
async function unfollowUser(req, res) {
  const { userId } = req.params;

  await followRepository.unfollowUser(
    req.user.userId,
    userId,
  );

  await deleteNotification({
    receiver: userId,
    sender: req.user.userId,
    type: "follow",
  });

  return res.status(200).json({
    success: true,
    data: null,
    error: null,
  });
}

async function searchUsers(req, res) {
  const { search } = req.query;

  const users = await userRepository.searchUsers(
    req.user.userId,
    search,
  );

  return res.status(200).json({
    success: true,
    data: {
      users,
    },
    error: null,
  });
}
async function getFollowers(req, res) {
  const followers = await followRepository.getFollowers(
    req.params.userId,
  );

  return res.status(200).json({
    success: true,
    data: {
      followers,
    },
    error: null,
  });
}
async function getFollowing(req, res) {
  const following = await followRepository.getFollowing(
    req.params.userId,
  );

  return res.status(200).json({
    success: true,
    data: {
      following,
    },
    error: null,
  });
}

async function uploadProfileImage(req, res) {
  if (!req.file) {
    throw new AppError("Please upload an image.", 400, "ValidationError");
  }

  const imageUrl = await uploadToS3(req.file);

  const user = await userRepository.updateProfileImage(
    req.user.userId,
    imageUrl,
  );

  return res.status(200).json({
    success: true,
    data: {
      user,
    },
    error: null,
  });
}


module.exports = {
  getMyProfile,
  updateMyProfile,
  getUserProfile,
  searchUsers,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  uploadProfileImage,
};
