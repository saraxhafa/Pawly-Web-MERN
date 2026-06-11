// Imports
const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");

const connectDB = require("./connect/database");
const { errorHandler } = require("./middlewares/errorMiddleware");

// Routes
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");
const contactRoutes = require("./routes/contactRoutes");

// Connect DB
connectDB();

// App init
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));



// CORS FIRST
app.use(
  cors({
    origin: "https://turbo-doodle-7v775r6479wg2p9px-5173.app.github.dev",
    credentials: true,
  })
);


//app.use(cors());

// Routes
//app.use("/api/tasks", taskRoutes);
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/contact", require("./routes/contactRoutes"));

// Error handler
app.use(errorHandler);



// test route
app.get("/", (req, res) => {
  res.send("API working");
});



// Start server
app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);