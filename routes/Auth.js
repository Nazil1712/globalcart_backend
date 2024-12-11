const express = require("express");
const { createUserAPI, loginUserAPI, checkAuth, resetPasswordRequest, resetPassword, logOut } = require("../controller/Auth");
const passport = require("passport");
const app = express();
const router = express.Router();

router
  .post("/signup", createUserAPI)
  .post("/login", passport.authenticate("local"), loginUserAPI) // Here we are generating JWT token
  .get("/check", passport.authenticate("jwt"), checkAuth) // While here we are verifying token
  .get("/logout", logOut)
  .post('/reset-password-request',resetPasswordRequest)
  .post('/reset-password',resetPassword)

module.exports = router;
