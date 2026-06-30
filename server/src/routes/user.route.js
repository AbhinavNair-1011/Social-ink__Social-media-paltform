const express = require("express");
const authMiddleware = require("../middlewares/auth");

const validate = require("../middlewares/validate");

const { updateProfileSchema } = require("../validators/user.validation");

const {
  getMyProfile,
  updateMyProfile,
} = require("../controllers/user.controller");

const router = express.Router();

router.get("/me", authMiddleware, getMyProfile);

router.patch("/me", authMiddleware, validate(updateProfileSchema), updateMyProfile,);
module.exports = router;
