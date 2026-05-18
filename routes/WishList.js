const express = require("express");
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controller/WishList");
const app = express();
const router = express.Router();

router
  .get("/", getWishlist)
  .post("/", addToWishlist)
  .delete("/:productId", removeFromWishlist);

module.exports = router;
