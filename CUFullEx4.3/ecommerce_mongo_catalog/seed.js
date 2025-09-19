/**
 * Simple seed script that inserts a few products demonstrating nested structures.
 * Run with: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/product');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_catalog';

async function seed() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB for seeding');

  await Product.deleteMany({});

  const products = [
    {
      title: 'Classic Tee',
      slug: 'classic-tee',
      description: 'A comfortable cotton tee available in multiple colors and sizes.',
      categories: [{ name: 'Clothing', slug: 'clothing' }, { name: 'Men', slug: 'men', ancestors: ['clothing'] }],
      tags: ['tshirt', 'cotton', 'classic'],
      images: [{ url: 'https://example.com/images/classic-tee.jpg', alt: 'Classic Tee' }],
      variants: [
        {
          sku: 'TEE-001-S-WHT',
          price: 1999,
          attributes: [{ key: 'size', value: 'S' }, { key: 'color', value: 'white' }],
          stock: 50
        },
        {
          sku: 'TEE-001-M-BLK',
          price: 1999,
          attributes: [{ key: 'size', value: 'M' }, { key: 'color', value: 'black' }],
          stock: 40
        }
      ],
      metadata: { vendor: 'Acme Apparel', weight: 200 }
    },
    {
      title: 'Wireless Headphones',
      slug: 'wireless-headphones',
      description: 'Noise-cancelling over-ear headphones with long battery life.',
      categories: [{ name: 'Electronics', slug: 'electronics' }],
      tags: ['audio', 'headphones', 'wireless'],
      images: [{ url: 'https://example.com/images/headphones.jpg', alt: 'Wireless Headphones' }],
      variants: [
        {
          sku: 'HP-100-BLK',
          price: 4999,
          attributes: [{ key: 'color', value: 'black' }],
          stock: 15,
          images: [{ url: 'https://example.com/images/headphones-side.jpg', alt: 'Side view' }]
        }
      ],
      metadata: { vendor: 'SoundCo', weight: 450 }
    }
  ];

  await Product.insertMany(products);
  console.log('Seed complete');
  mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
