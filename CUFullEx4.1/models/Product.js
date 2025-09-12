const mongoose = require("mongoose");

// Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: String,
  inStock: { type: Boolean, default: true }
});

// Model
module.exports = mongoose.model("Product", productSchema);
