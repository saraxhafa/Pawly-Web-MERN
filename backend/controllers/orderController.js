const Order = require("../models/orderModel");
const Product = require("../models/productModel");


// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const { products, paymentMethod } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let total = 0;

    const enrichedProducts = await Promise.all(
      products.map(async (item) => {
        const product = await Product.findById(item.productId);

        if (!product) {
          throw new Error(`Product not found in system`);
        }

        const subtotal = product.price * item.quantity;
        total += subtotal;

        return {
          productId: product._id,
          productName: product.name,   // ✔ emri
          priceAtPurchase: product.price,
          quantity: item.quantity,
        };
      })
    );

    const order = await Order.create({
      user: req.user._id,
      products: enrichedProducts,
      total,
      paymentMethod,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// GET MY ORDERS
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE ORDER (user can update own order)
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not authorized to update this order",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE ORDER
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        message: "Not authorized to delete this order",
      });
    }

    await order.deleteOne();

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  updateOrder,
  deleteOrder,
};