const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const cookieParser = require("cookie-parser")

const productsRouter = require("./routes/Product");
const brandsRouter = require("./routes/Brand");
const categoryRouter = require("./routes/Category");
const userRouter = require("./routes/User")
const authRouter = require("./routes/Auth")
const cartRouter = require("./routes/Cart")
const orderRouter = require("./routes/Order")
const cors = require("cors");
const { User } = require("./model/User");
const { isAuth, sanitizeUser, cookiExtractor } = require('./services/common');

const SECRET_KEY = 'SECRET_KEY';

// JWT options
const opts = {};
opts.jwtFromRequest = cookiExtractor;
opts.secretOrKey = SECRET_KEY; // TODO: should not be in code;

app.use(express.static('build'))
app.use(cookieParser())
app.use(express.json()); // to parse req.body

app.use(session({
  secret: 'Keyboard cat',
  resave: false,  //  don't save session if unmodified
  saveUninitialized: false, // don't create session until something is stored
}))
app.use(passport.authenticate('session'))


/* Handling CORS Request errors */
const corsOptions = {
  origin: 'http://localhost:3000', // Adjust this if you're using a different frontend URL
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS','PUT'], // Include PATCH method
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
  exposedHeaders: ["X-Total-Count"],  // For pagination
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));  // To enable pre-flight CORS across-the-board
/* Handling CORS Request errors */


app.use("/products", isAuth(), productsRouter);
app.use("/brands", isAuth(),brandsRouter);
app.use("/categories",isAuth(), categoryRouter);
app.use("/users",isAuth(), userRouter);
app.use("/auth", authRouter)
app.use("/cart",isAuth(), cartRouter)
app.use('/order',isAuth(),orderRouter)


passport.use(new LocalStrategy({
  usernameField: 'email',  // if you're sending 'email' instead of 'username'
  passwordField: 'password'
}, async function (email, password, done) {
  // console.log("LocalStrategy")
  try {
    const user = await User.findOne({ email: email });
    // console.log("Data from LocalStrategy",email, password, user);
    if (!user) {
      return done(null, false, { message: 'invalid credentials' }); // for safety
    }
    crypto.pbkdf2(
      password,
      user.salt,
      310000,
      32,
      'sha256',
      async function (err, hashedPassword) {
        if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
          return done(null, false, { message: 'invalid credentials' });
        }
        const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
        done(null, sanitizeUser(user)); // this lines sends to serializer
      }
    );
  }
  catch(error) {
    // console.log("ERROR",error)
    done(error)
  }
}))


passport.use(
  'jwt',
  new JwtStrategy(opts, async function (jwt_payload, done) {
    // console.log("JWT Payload",jwt_payload.id);
    // console.log("JWT Payload",jwt_payload.role);
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, sanitizeUser(user)); // this calls serializer
      } else {
        // console.log("Can't find user")
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);


passport.serializeUser(function (user, cb){
  // console.log("Serialize",user)
  process.nextTick(function () {
    return cb(null, {id: user.id, role: user.role})
  })
})


passport.deserializeUser(function (user, cb){
  // console.log("De-Serialize",user)
  process.nextTick(function (){
    return cb(null, user)
  })
})


main().catch((error) => {
  console.log(error);
});

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/globalcart");
  console.log("Datbase connected");
}

const PORT = 8080;

app.get("/", (req, res) => {
  res.json({ status: "success" });
});

app.listen(PORT, () => {
  console.log(`Server runnig on port ${PORT}`);
});
