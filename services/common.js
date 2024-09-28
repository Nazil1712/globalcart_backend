const passport = require("passport");

exports.isAuth = (req, res, done) => {
  return passport.authenticate("jwt");
};

exports.sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

exports.cookiExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  // console.log("I am in cookie Extractor",req.cookies)
  token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZWZiZDU5YmU5YmE1YWM2OGQzNjY4YiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcyNzUwMjM5NX0.fH8TA1j4Fsc3YPAcnlXmAQ93tI3LdATxP_kE-uM4s9A";
  return token;
};
