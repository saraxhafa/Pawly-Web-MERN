
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Product = require("./models/productModel");

dotenv.config();

const products = [
  {
    name: "Dog Leash",
    price: 15,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500",
    stock: 20,
  },
  {
    name: "Cat Food Premium",
    price: 25,
    category: "Food",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500",
    stock: 20,
  },
  {
    name: "Pet Shampoo",
    price: 10,
    category: "Personal Care",
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e",
    stock: 20,
  },
  {
    name: "Ball Pets",
    price: 10,
    category: "Toys",
    image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97",
    stock: 20,
  },
  {
    name: "Set of hair Brush For Pets",
    price: 20,
    category: "Personal Care",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500",
    stock: 20,
  },
  {
    name: "Retractable Leash",
    price: 20,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=500",
    stock: 20,
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    for (const product of products) {
      await Product.findOneAndUpdate(
        { name: product.name },
        { $setOnInsert: product },
        { upsert: true, new: true }
      );
    }

    console.log("Products registered successfully!");

    const savedProducts = await Product.find();
    console.log(savedProducts);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Product registration failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedProducts();
