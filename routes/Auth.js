const express = require("express");
const { createUserAPI, loginUserAPI, checkUserAPI } = require("../controller/Auth");
const passport = require("passport");
const app = express();
const router = express.Router();

router
  .post("/signup", createUserAPI)
  .post("/login", passport.authenticate("local"), loginUserAPI) // Here we are generating JWT token
  .get("/check", passport.authenticate("jwt"), checkUserAPI) // While here we are verifying token

module.exports = router;
