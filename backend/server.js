const express = require('express');
const { errorHandler } = require('./middlewares/errorMiddleware');
const dotenv = require('dotenv').config();
const connectDB = require('./connect/database');

const port = process.env.PORT || 8000;

connectDB();

const app = express();

// middleware për JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 🔥 logger (vendose sipër routes)
app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

// routes
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// error handler (DUHET FARE NË FUND)
app.use(errorHandler);



// 👇 KËTU E FUS
app.get("/", (req, res) => {
  res.send("API is running");
});



app.listen(port, () =>
  console.log(`Server listening on ${port}`)
);
