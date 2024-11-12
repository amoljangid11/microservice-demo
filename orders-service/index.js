const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
const PORT = 3003;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/microservicesDemo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB for Orders Service'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Define Order schema
const orderSchema = new mongoose.Schema({
    userId: Number,
    productId: Number,
    user: Object,
    product: Object,
});

const Order = mongoose.model('Order', orderSchema);

app.use(cors());
app.use(bodyParser.json());

app.post('/orders', async (req, res) => {
    const { userId, productId } = req.body;

    try {
        // Fetch user and product details from respective services
        const userResponse = await axios.get(`http://localhost:3001/users/${userId}`);
        const productResponse = await axios.get(`http://localhost:3002/products/${productId}`);

        const order = new Order({
            userId,
            productId,
            user: userResponse.data,
            product: productResponse.data,
        });

        await order.save();
        res.status(201).send(order);
    } catch (error) {
        res.status(500).send({ error: 'Error creating order' });
    }
});

app.listen(PORT, () => {
    console.log(`Orders Service running on port ${PORT}`);
});
