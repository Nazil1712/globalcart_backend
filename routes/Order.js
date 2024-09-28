const express = require("express");
const {
    fetchOrderByUserAPI,
    createOrderAPI,
    updateOrderAPI,
    deleteOrderAPI,
    fetchAllOrdersAPI
} = require("../controller/Order");
const app = express();
const router = express.Router();


router
  .get("/users/own", fetchOrderByUserAPI)
  .post("/",createOrderAPI)
  .patch("/:id",updateOrderAPI)
  .delete("/:id",deleteOrderAPI)
  .get('/',fetchAllOrdersAPI)

module.exports = router;
