const { User } = require("../model/User");
const crypto = require("crypto");
const { sanitizeUser } = require("../services/common");
const SECRET_KEY = "SECRET_KEY";
const jwt = require("jsonwebtoken");

exports.createUserAPI = async (req, res) => {
  // console.log("User from createUserAPI", req.body);
  try {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const doc = await user.save();
        const userIdR = sanitizeUser(doc);
        req.login(userIdR, (err) => {
          // this also calls serializer and creates a new session
          if (err) {
            res.status(400).json(err);
          } else {
            const token = jwt.sign(userIdR, SECRET_KEY);
            res
              .cookie("jwt", token, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true,
                sameSite: "Strict",
              })
              .status(201)
              .json(userIdR);
            // console.log("Token", token);
          }
        });
      }
    );
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.loginUserAPI = async (req, res) => {
  res
    .cookie("jwt", req.user.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
      sameSite: "Strict",
    })
    .status(201)
    .json(req.user);

  console.log("Cookie has been set successfully");
};

exports.checkAuth = async (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    console.log("hey bro Error is here");
    res.sendStatus(401);
  }
};
