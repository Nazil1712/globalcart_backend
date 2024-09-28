const express = require("express");
const {
  fetchCartByUserAPI,
  addToCartAPI,
  deleteFromCartAPI,
  updateCartAPI,
} = require("../controller/Cart");
const app = express();
const router = express.Router();


router
  .post("/", addToCartAPI)
  .get("/own", fetchCartByUserAPI)
  .delete("/:id", deleteFromCartAPI)
  .patch("/:id", updateCartAPI);

module.exports = router;
