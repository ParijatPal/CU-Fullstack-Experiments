const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const productRoutes = require("./routes/productRoutes");

const app = express();
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/productDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.log("❌ DB connection error:", err));

// Routes
app.use("/products", productRoutes);

// Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
