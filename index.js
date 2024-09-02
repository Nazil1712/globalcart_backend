const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { createProduct } = require("./controller/Product");
const productsRouter = require("./routes/Product");
const brandsRouter = require("./routes/Brand");
const categoryRouter = require("./routes/Category");
const cors = require("cors");

// Middlewares
app.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);
app.use(express.json()); // to parse req.body
app.use("/products", productsRouter);
app.use("/brands", brandsRouter);
app.use("/categories", categoryRouter);

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
