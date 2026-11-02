
const express = require("express");

const {
  createOrder,
  getMyOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

const { protect } = require("../middlewares/authMiddlewares");

const router = express.Router();

// All order routes require authentication
router.post("/createorder", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.put("/:id", protect, updateOrder);
router.delete("/:id", protect, deleteOrder);

module.exports = router;
