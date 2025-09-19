require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const productsRouter = require('./routes/products');

const app = express();
app.use(morgan('dev'));
app.use(bodyParser.json());

app.use('/api/products', productsRouter);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce_catalog';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
  })
  .catch(err => {
    console.error('Mongo connection error:', err);
  });
