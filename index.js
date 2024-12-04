const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");

// passportJs things
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const crypto = require("crypto"); // crypto is in-built library in nodejs

// Jwt things
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;

const cookieParser = require("cookie-parser");
const productsRouter = require("./routes/Product");
const brandsRouter = require("./routes/Brand");
const categoryRouter = require("./routes/Category");
const userRouter = require("./routes/User");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const orderRouter = require("./routes/Order");
const cors = require("cors");
const { User } = require("./model/User");
const { isAuth, sanitizeUser, cookiExtractor } = require("./services/common");
const path = require("path");

const SECRET_KEY = "SECRET_KEY";

// JWT options
const opts = {};
opts.jwtFromRequest = cookiExtractor;
opts.secretOrKey = SECRET_KEY; // TODO: should not be in code;

// app.use(express.static(path.resolve(__dirname,'build')))
app.use(cookieParser()); // so that we can have cookies
// app.use(express.raw({type: 'application/json'}))
app.use(express.json()); // to parse req.body

// Adding passport and session middlewares
app.use(
  session({
    secret: "Keyboard cat",
    resave: false, // If false, don't save session if unmodified
    saveUninitialized: false, // If false, don't create session until something is stored
  })
);
app.use(passport.authenticate("session"));

/* Handling CORS Request errors */
const corsOptions = {
  origin: "http://localhost:3000", // Adjust this if you're using a different frontend URL
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS", "PUT"], // Include PATCH method
  allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
  exposedHeaders: ["X-Total-Count"], // For pagination
  credentials: true,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // To enable pre-flight CORS across-the-board
/* Handling CORS Request errors */

app.use("/products", isAuth(), productsRouter);
app.use("/brands", isAuth(), brandsRouter);
app.use("/categories", isAuth(), categoryRouter);
app.use("/users", isAuth(), userRouter);
app.use("/auth", authRouter);
app.use("/cart", isAuth(), cartRouter);
app.use("/order", isAuth(), orderRouter);

// LocalStrategy
passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email", // if you're sending 'email' instead of 'username'
      passwordField: "password",
    },
    async function (email, password, done) {
      // console.log("LocalStrategy")
      console.log("email", email);
      console.log("password", password);
      try {
        const user = await User.findOne({ email: email });
        // console.log("Data from LocalStrategy",email, password, user);
        console.log("User", user);
        if (!user) {
          return done(null, false, { message: "invalid credentials" }); // for safety
        }
        crypto.pbkdf2(
          password,
          user.salt,
          310000,
          32,
          "sha256",
          async function (err, hashedPassword) {
            if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
              return done(null, false, { message: "invalid credentials" });
            }
            const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
            console.log("Sending success message", token);
            done(null, { id: user.id, role: user.role, token }); // this line calls serializer
          }
        );
      } catch (error) {
        // console.log("ERROR",error)
        done(error);
      }
    }
  )
);

// Jwt Strategy
passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    // console.log("JWT Payload",jwt_payload.id);
    // console.log("JWT Payload",jwt_payload.role);
    console.log("JWT payload", jwt_payload);
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

// this creates session variable req.user on being called
passport.serializeUser(function (user, cb) {
  console.log("Serialize", user);
  process.nextTick(function () {
    return cb(null, { id: user.id, role: user.role });
  });
});

// this creates session variable req.user when called from authorized user
passport.deserializeUser(function (user, cb) {
  // console.log("De-Serialize",user)
  process.nextTick(function () {
    return cb(null, user);
  });
});

/* Payments */

// This is your test secret API key.
const stripe = require("stripe")(
  "sk_test_51OtpkYSGP9Cy7vF1jVeqvoRbkQ2yvoJi1aQB7CRA6gG5fshiQnV66QQOFMbG60QmfNjL1gTgg5VLKLxmWnriFYxr009I6ul1Yv"
);

// const calculateOrderAmount = (items) => {
//   return 1400; // in paisa
// };

app.post("/create-payment-intent", async (req, res) => {
  const { totalAmount } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100, // beacuse stripe works in "PAISA" instead of "Rupees"
    currency: "inr",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

// Webhook

/* const endpointSecret = "whsec_8bff4c5401fbc4ee2108713be1bfaa3a9fa9ee9f204204517508c4af257601eb";

app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      console.log({paymentIntentSucceeded})
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});
 */

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
