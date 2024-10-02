const express = require("express");
const { createUserAPI, loginUserAPI, checkAuth } = require("../controller/Auth");
const passport = require("passport");
const app = express();
const router = express.Router();

router
  .post("/signup", createUserAPI)
  .post("/login", passport.authenticate("local"), loginUserAPI) // Here we are generating JWT token
  .get("/check", passport.authenticate("jwt"), checkAuth) // While here we are verifying token

module.exports = router;
