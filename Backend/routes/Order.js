const express = require("express");
const {
  createOrder,
  fetchOrdersByUser,
  updateOrder,
  deleteOrder,
  fetchAllOrders,
} = require("../controller/Order");

const router = express.Router();

router
  .post("/", createOrder)
  .get("/users/:userId", fetchOrdersByUser)
  .delete("/:id", deleteOrder)
  .patch("/:id", updateOrder)
  .get('/',fetchAllOrders)
exports.router = router;
