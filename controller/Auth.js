const { User } = require("../model/User");
const crypto = require("crypto");
const { sanitizeUser, sendMail } = require("../services/common");
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

  const user = req.user;

  res
    .cookie("jwt", user.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
      sameSite: "Lax"
    })
    .status(201)
    .json({id: user.id, role:user.role});

  // console.log("Cookie has been set successfully");
};

exports.checkAuth = async (req, res) => {
  // console.log(req.user, "user")
  if (req.user) {
    res.json(req.user);
  } else {
    // console.log("hey bro Error is here");
    res.sendStatus(401);
  }
};

exports.resetPasswordRequest = async (req, res) => {
  const email = req.body.email
  const user = await User.findOne({ email:  email});

  if (user) {
    const token = crypto.randomBytes(40).toString("hex");
    user.resetPasswordToken = token;
    await user.save()

    const resetPageLink = `http://localhost:3000/reset-password?token=`+token+`&email=${email}`;
    const subject = "Reset password for E-commerce";
    const html = `<p>Click <a href=${resetPageLink}>here</a> to reset your password</p>`;

    // console.log("FOr mail sending", req.body);
    if (email) {
      const response = await sendMail(req.body.email, subject, null, html);
      // console.log("REsponse", response);
      res.send({status: "Success"})
    } else {
      // console.log("hey bro Error is here");
      res.sendStatus(401);
    }
  }
  else{
    res.sendStatus(401);
  }
};

exports.resetPassword = async (req, res) => {
  const {email, password, token} = req.body

  const user = await User.findOne({ email:  email, resetPasswordToken: token});

  if (user) {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        user.password = hashedPassword;
        user.salt = salt;
        await user.save()
      }
    );

    const subject = "Password successfully reset for E-commerce";
    const html = `<p>Successfully able to reset your password</p>`;

    // console.log("FOr mail sending", req.body);
    if (email) {
      const response = await sendMail(req.body.email, subject, null, html);
      // console.log("REsponse", response);
      res.send({status: "Success"})
    } else {
      // console.log("hey bro Error is here");
      res.sendStatus(401);
    }
  }
  else{
    res.sendStatus(401);
  }
};


exports.logOut = async(req,res) =>{
  res
    .cookie("jwt", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .status(200)
    .json({status: "success"})

  // console.log("SignOut controller called");
}