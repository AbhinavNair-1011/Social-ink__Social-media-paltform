const User = require("../models/user.model");
const AppError = require("../utils/AppError");

async function getMyProfile(req, res) {
  const user = await User.findById(req.user.userId).select(
    "name email userName dob bio profileImage",
  );

  if (!user) {
    throw new AppError("User not found", 404, "NotFoundError");
  }

  return res.status(200).json({
    success: true,
    data: {
      user,
    },
    error: null,
  });
}


async function updateMyProfile(req, res) {
  const updatedUser = await User.findByIdAndUpdate(req.user.userId, req.body, {
    new: true,
    runValidators: true,
  }).select("name email userName dob bio profileImage");

  if (!updatedUser) {
    throw new AppError("User not found", 404, "NotFoundError");
  }

  return res.status(200).json({
    success: true,

    data: {
      user: updatedUser,
    },

    error: null,
  });
}
module.exports = {
  getMyProfile,
  updateMyProfile,
};
