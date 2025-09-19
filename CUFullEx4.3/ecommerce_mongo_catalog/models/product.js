const mongoose = require('mongoose');
const { Schema } = mongoose;

// Image subdocument
const ImageSchema = new Schema({
  url: { type: String, required: true },
  alt: { type: String }
}, { _id: false });

// Attribute key-value for variant or product-level
const AttributeSchema = new Schema({
  key: { type: String, required: true },
  value: { type: String, required: true }
}, { _id: false });

// Variant subdocument for different SKUs, sizes, colors etc.
const VariantSchema = new Schema({
  sku: { type: String, required: true, index: true },
  price: { type: Number, required: true },
  compareAtPrice: { type: Number },
  attributes: [AttributeSchema],
  stock: { type: Number, default: 0 },
  images: [ImageSchema]
}, { timestamps: true });

// Category as nested subdocument (supports nested categories via 'ancestors' if desired)
const CategorySchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  ancestors: [{ type: String }] // optional list of ancestor slugs/names
}, { _id: false });

// Main Product schema
const ProductSchema = new Schema({
  title: { type: String, required: true, index: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  categories: [CategorySchema],
  tags: [{ type: String, index: true }],
  images: [ImageSchema],
  variants: [VariantSchema],
  metadata: {
    weight: Number,
    dimensions: {
      width: Number,
      height: Number,
      depth: Number
    },
    vendor: String
  },
  published: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Example compound index to speed up common queries
ProductSchema.index({ 'variants.sku': 1 });

module.exports = mongoose.model('Product', ProductSchema);
