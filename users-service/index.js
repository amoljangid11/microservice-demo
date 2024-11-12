const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 3001;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/microservicesDemo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB for Users Service'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Define User schema
const userSchema = new mongoose.Schema({
    id: Number,
    name: String,
});

const User = mongoose.model('User', userSchema);

app.use(cors());
app.use(bodyParser.json());

app.post('/users', async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.status(201).send(user);
});

app.get('/users/:userId', async (req, res) => {
    const users = await User.find();
    res.status(200).send(users);
});

app.listen(PORT, () => {
    console.log(`Users Service running on port ${PORT}`);
});
