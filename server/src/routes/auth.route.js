const express = require("express");

const router = express.Router();

const validate = require("../middlewares/validate");

const {
  registerUsersSchema,
  loginUsersSchema,
} = require("../validators/auth.validation");

const {
  register,
  login,
  refresh,
  logout
} = require("../controllers/auth.controller");

router.post(
  "/register",
  validate(registerUsersSchema),
  register
);

router.post(
  "/login",
  validate(loginUsersSchema),
  login
);
router.post("/refresh", refresh);

router.post("/logout",logout);
module.exports = router;



// router.get("/me");

