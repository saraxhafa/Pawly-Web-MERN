// Importing necessary modules
const express = require('express');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middlewares/errorMiddleware');
const connectDB = require('./connect/database');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');
const contactRoutes = require("./routes/contactRoutes");

// Connecting to the database
console.log("Starting server...");
connectDB();
console.log("After DB connect");

// Setting the port for the server
const port = process.env.PORT || 5000;

// Initializing the Express application
const app = express();

// Enabling CORS for all routes
app.use(cors());

/*app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));*/


// 🔥 IMPORTANT: handle preflight
//app.options("*", cors());
//app.options("*", cors());

// Middleware to parse JSON bodies in requests
app.use(express.json());

// Middleware to parse URL-encoded bodies in requests
app.use(express.urlencoded({ extended: false }));

// Importing and using task routes
app.use('/api/tasks', require('./routes/taskRoutes'));

// Importing and using user routes
app.use('/api/users', require('./routes/userRoutes'));

// Importing and using order routes
app.use('/api/orders', orderRoutes);

// Importing and using contact routes
app.use('/api/contact', contactRoutes);

// Using the custom error handling middleware
app.use(errorHandler);

//contact routes
app.use("/api/contact", contactRoutes);

// Starting the server and listening on the specified port
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`))
