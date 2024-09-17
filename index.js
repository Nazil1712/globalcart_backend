const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { createProduct } = require("./controller/Product");
const productsRouter = require("./routes/Product");
const brandsRouter = require("./routes/Brand");
const categoryRouter = require("./routes/Category");
const userRouter = require("./routes/User")
const authRouter = require("./routes/Auth")
const cartRouter = require("./routes/Cart")
const orderRouter = require("./routes/Order")
const cors = require("cors");


const corsOptions = {
  origin: 'http://localhost:3000', // Adjust this if you're using a different frontend URL
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS','PUT'], // Include PATCH method
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
  exposedHeaders: ["X-Total-Count"],  // For pagination
};

app.use(cors(corsOptions));

// Preflight OPTIONS requests handling
app.options('*', cors(corsOptions));  // To enable pre-flight CORS across-the-board
app.use(express.json()); // to parse req.body
app.use("/products", productsRouter);
app.use("/brands", brandsRouter);
app.use("/categories", categoryRouter);
app.use("/users", userRouter);
app.use("/auth", authRouter)
app.use("/cart", cartRouter)
app.use('/order',orderRouter)

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
