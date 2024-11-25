const passport = require("passport");

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
