
const mongoose = require("mongoose");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");

// CREATE ORDER
const createOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { products, paymentMethod, paymentDetails } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    const allowedMethods = ["CASH", "DEBIT", "CREDIT", "WALLET"];

    if (!allowedMethods.includes(paymentMethod)) {
      return res.status(400).json({
        message: "Invalid payment method",
      });
    }

    // Validate and prepare safe payment information
    let safePaymentDetails;

    if (paymentMethod === "DEBIT" || paymentMethod === "CREDIT") {
      const cardHolder = paymentDetails?.cardHolder?.trim();
      const maskedCardNumber = paymentDetails?.maskedCardNumber;

      if (!cardHolder || cardHolder.length < 2) {
        return res.status(400).json({
          message: "Invalid cardholder name",
        });
      }

      // Accept only a masked number with the last four digits visible.
      if (
        typeof maskedCardNumber !== "string" ||
        !/^\*{9,15}\d{4}$/.test(maskedCardNumber)
      ) {
        return res.status(400).json({
          message: "Invalid masked card number",
        });
      }

      safePaymentDetails = {
        cardHolder,
        maskedCardNumber,
      };
    }

    if (paymentMethod === "WALLET") {
      const walletProvider = paymentDetails?.walletProvider?.trim();
      const walletEmail = paymentDetails?.walletEmail?.trim();

      const allowedProviders = [
        "PayPal",
        "Google Pay",
        "Apple Pay",
        "Other",
      ];

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!allowedProviders.includes(walletProvider)) {
        return res.status(400).json({
          message: "Invalid wallet provider",
        });
      }

      if (!walletEmail || !emailPattern.test(walletEmail)) {
        return res.status(400).json({
          message: "Invalid wallet email",
        });
      }

      safePaymentDetails = {
        walletProvider,
        walletEmail: walletEmail.toLowerCase(),
      };
    }

    // Validate and combine duplicate product IDs
    const quantities = new Map();

    for (const item of products) {
      if (
        !mongoose.Types.ObjectId.isValid(item.productId) ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
      ) {
        return res.status(400).json({
          message: "Invalid product or quantity",
        });
      }

      const id = item.productId.toString();

      quantities.set(
        id,
        (quantities.get(id) || 0) + item.quantity
      );
    }

    let createdOrder;

    await session.withTransaction(async () => {
      let total = 0;
      const enrichedProducts = [];

      for (const [productId, quantity] of quantities) {
        const product = await Product.findById(productId).session(
          session
        );

        if (!product) {
          throw new Error("Product not found in system");
        }

        // Atomically check and decrease stock
        const stockUpdate = await Product.updateOne(
          {
            _id: product._id,
            stock: { $gte: quantity },
          },
          {
            $inc: { stock: -quantity },
          },
          { session }
        );

        if (stockUpdate.modifiedCount !== 1) {
          throw new Error(
            `Insufficient stock for ${product.name}`
          );
        }

        const subtotal = product.price * quantity;
        total += subtotal;

        enrichedProducts.push({
          productId: product._id,
          name: product.name,
          category: product.category,
          priceAtPurchase: product.price,
          quantity,
        });
      }

      const orderData = {
        user: req.user._id,
        products: enrichedProducts,
        total,
        paymentMethod,
      };

      // Save only approved payment fields.
      // Any full card number or CVV sent by a client is ignored.
      if (safePaymentDetails) {
        orderData.paymentDetails = safePaymentDetails;
      }

      const orders = await Order.create(
        [orderData],
        { session }
      );

      createdOrder = orders[0];
    });

    return res.status(201).json(createdOrder);
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message,
    });
  } finally {
    await session.endSession();
  }
};

// GET MY ORDERS
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE ORDER - ALLOW CANCELLATION ONLY
const updateOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    if (req.body.status !== "Cancelled") {
      return res.status(400).json({
        message: "Only order cancellation is allowed",
      });
    }

    let updatedOrder;

    await session.withTransaction(async () => {
      const order = await Order.findById(req.params.id).session(
        session
      );

      if (!order) {
        throw new Error("Order not found");
      }

      if (order.user.toString() !== req.user._id.toString()) {
        const error = new Error(
          "Not authorized to update this order"
        );
        error.statusCode = 403;
        throw error;
      }

      if (order.status !== "Pending") {
        throw new Error("Only pending orders can be cancelled");
      }

      // Restore product stock
      for (const item of order.products) {
        await Product.updateOne(
          { _id: item.productId },
          { $inc: { stock: item.quantity } },
          { session }
        );
      }

      order.status = "Cancelled";
      updatedOrder = await order.save({ session });
    });

    return res.status(200).json(updatedOrder);
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message,
    });
  } finally {
    await session.endSession();
  }
};

// DELETE ORDER - PENDING ORDERS ONLY
const deleteOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      const order = await Order.findById(req.params.id).session(
        session
      );

      if (!order) {
        throw new Error("Order not found");
      }

      if (order.user.toString() !== req.user._id.toString()) {
        const error = new Error(
          "Not authorized to delete this order"
        );
        error.statusCode = 403;
        throw error;
      }

      if (order.status !== "Pending") {
        throw new Error("Only pending orders can be deleted");
      }

      // Restore stock before deleting the order
      for (const item of order.products) {
        await Product.updateOne(
          { _id: item.productId },
          { $inc: { stock: item.quantity } },
          { session }
        );
      }

      await order.deleteOne({ session });
    });

    return res.status(200).json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      message: error.message,
    });
  } finally {
    await session.endSession();
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  updateOrder,
  deleteOrder,
};
