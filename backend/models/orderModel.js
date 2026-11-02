
const mongoose = require("mongoose");

// PAYMENT DETAILS SCHEMA
const paymentDetailsSchema = new mongoose.Schema(
  {
    cardHolder: {
      type: String,
      trim: true,
    },

    maskedCardNumber: {
      type: String,
      trim: true,
    },

    walletProvider: {
      type: String,
      trim: true,
    },

    walletEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
  },
  { _id: false }
);

// CUSTOMER SNAPSHOT SCHEMA
const customerSnapshotSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  },
  { _id: false }
);

// ORDER SCHEMA
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    customerSnapshot: {
      type: customerSnapshotSchema,
      required: false,
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        name: {
          type: String,
          required: true,
          trim: true,
        },

        priceAtPurchase: {
          type: Number,
          required: true,
          min: 0,
        },

        category: {
          type: String,
          trim: true,
        },
      },
    ],

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["CASH", "DEBIT", "CREDIT", "WALLET"],
      default: "CASH",
    },

    paymentDetails: {
      type: paymentDetailsSchema,
      default: undefined,
    },

    status: {
      type: String,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);

