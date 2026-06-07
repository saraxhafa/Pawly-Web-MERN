const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    products: [
      {
        productId:  {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
        quantity: {
      type: Number,
      required: true,
    },
        name:String,
        priceAtPurchase: Number,
        category:String,
      },
    ],

    total: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["CASH", "DEBIT", "CREDIT", "WALLET"],
      default: "CASH",
    },

    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);