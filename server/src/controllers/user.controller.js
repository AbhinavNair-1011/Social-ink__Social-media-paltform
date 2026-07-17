const User = require("../models/user.model");
const AppError = require("../utils/appError");
const Follow = require("../models/follow.model");
const Post = require("../models/post.model");
const uploadToS3 = require("../utils/uploadToS3");
const { createNotification, deleteNotification } = require("../services/notification.service");
async function getMyProfile(req, res) {
  const user = await User.findById(req.user.userId).select(
    "name email userName dob bio profileImage createdAt",
  );

  if (!user) {
    throw new AppError("User not found", 404, "NotFoundError");
  }

  const postsCount = await Post.countDocuments({
    author: req.user.userId,
  });

  const followersCount = await Follow.countDocuments({
    following: req.user.userId,
  });

  const followingCount = await Follow.countDocuments({
    follower: req.user.userId,
  });

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
  const updatedUser = await User.findByIdAndUpdate(req.user.userId, req.body, {
    new: true,
    runValidators: true,
  }).select("name email userName dob bio profileImage createdAt");

  if (!updatedUser) {
    throw new AppError("User not found", 404, "NotFoundError");
  }

  const postsCount = await Post.countDocuments({
    author: req.user.userId,
  });

  const followersCount = await Follow.countDocuments({
    following: req.user.userId,
  });

  const followingCount = await Follow.countDocuments({
    follower: req.user.userId,
  });

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

  const user = await User.findById(userId).select(
    "name userName bio profileImage createdAt",
  );

  if (!user) {
    throw new AppError("User not found", 404, "NotFoundError");
  }

  const postsCount = await Post.countDocuments({
    author: userId,
  });

  const followersCount = await Follow.countDocuments({
    following: userId,
  });

  const followingCount = await Follow.countDocuments({
    follower: userId,
  });

  const isFollowing = Boolean(
    await Follow.findOne({
      follower: req.user.userId,
      following: userId,
    }),
  );

  const isMe = user._id.toString() === req.user.userId;
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

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404, "NotFoundError");
  }

  await Follow.create({
    follower: req.user.userId,
    following: userId,
  });
  await createNotification({
    receiver: followingUserId,
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

  await Follow.findOneAndDelete({
    follower: req.user.userId,
    following: userId,
  });
  await deleteNotification({
    receiver: followedUser._id,
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

  const users = await User.find({
    _id: { $ne: req.user.userId },

    $or: [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        userName: {
          $regex: search,
          $options: "i",
        },
      },
    ],
  })
    .select("name userName profileImage bio")
    .limit(10);

  return res.status(200).json({
    success: true,
    data: {
      users,
    },
    error: null,
  });
}
async function getFollowers(req, res) {
  const followers = await Follow.find({
    following: req.params.userId,
  }).populate("follower", "name userName profileImage bio");

  return res.status(200).json({
    success: true,
    data: {
      followers: followers.map((item) => item.follower),
    },
    error: null,
  });
}
async function getFollowing(req, res) {
  const following = await Follow.find({
    follower: req.params.userId,
  }).populate("following", "name userName profileImage bio");

  return res.status(200).json({
    success: true,
    data: {
      following: following.map((item) => item.following),
    },
    error: null,
  });
}

async function uploadProfileImage(req, res) {
  if (!req.file) {
    throw new AppError("Please upload an image.", 400, "ValidationError");
  }

  const imageUrl = await uploadToS3(req.file);

  const user = await User.findByIdAndUpdate(
    req.user.userId,
    {
      profileImage: imageUrl,
    },
    {
      new: true,
    },
  ).select("name email userName dob bio profileImage createdAt");

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
