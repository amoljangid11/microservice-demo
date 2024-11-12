const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 3002;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/microservicesDemo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB for Products Service'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Define Product schema
const productSchema = new mongoose.Schema({
    id: Number,
    name: String,
});

const Product = mongoose.model('Product', productSchema);

app.use(cors());
app.use(bodyParser.json());

app.post('/products', async (req, res) => {
    const product = new Product(req.body);
    await product.save();
    res.status(201).send(product);
});

app.get('/products/:productId', async (req, res) => {
    const products = await Product.find();
    res.status(200).send(products);
});

app.listen(PORT, () => {
    console.log(`Products Service running on port ${PORT}`);
});
