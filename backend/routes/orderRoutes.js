const express = require("express");

const {
  createOrder,
  getMyOrders,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

const { protect } = require("../middlewares/authMiddlewares");

const router = express.Router();

router.post("/createorder", protect, createOrder);
router.get("/myorders", protect, getMyOrders);
router.put("/:_id", protect, updateOrder);
router.delete("/:_id", protect, deleteOrder);


module.exports = router;