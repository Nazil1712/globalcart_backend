const express = require("express");
const {
    fetchOrderByUserAPI,
    createOrderAPI,
    updateOrderAPI,
    deleteOrderAPI
} = require("../controller/Order");
const app = express();
const router = express.Router();


router
  .get("/", fetchOrderByUserAPI)
  .post("/",createOrderAPI)
  .patch("/:id",updateOrderAPI)
  .delete("/:id",deleteOrderAPI)

module.exports = router;
