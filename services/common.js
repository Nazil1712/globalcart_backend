const passport = require("passport");
const nodemailer = require("nodemailer");

exports.isAuth = (req, res, done) => {
  return passport.authenticate("jwt");
};

exports.sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

exports.cookiExtractor = function (req) {
  let token = null;
  // console.log("Cookies",req.cookies)
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  // console.log("After JWt",req.cookies['jwt'])
  // console.log("I am in cookie Extractor",req.cookies)
  // token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDNmNmE2ZmY2NGNjYjgyYWZkOThkYiIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzMyNTA3NDA2fQ.sEAp7D1d0GVyM1JYX1x5jDXVwv7He_GpY5lH1VSChpk";

  return token;
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: "ndhalwala@gmail.com",
    pass: "cystbfxmssuvwqvg",
  },
});


exports.sendMail = async function (to, subject, text, html) {
  const info = await transporter.sendMail({
    from: '"E-Commerce" <ndhalwala@gmail.com>', // sender address
    to: to,
    subject: subject,
    html: html,
    text: text,
  });

  // console.log("Email info", info);
  return info
};
