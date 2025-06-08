const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const path = 'http://localhost'
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(error => console.error('MongoDB connection failed:', error));

const User = require('./models/User');
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    return res.status(201).json({message:'Login success!'})
  } catch (error) {
    console.error('Login error: ', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
})

app.post('/seedAdmin', async (req, res) => {
  try {
    const newUser = new User({ email: 'test@gmail.com', password: 'test123' });
    await newUser.save();
    return res.status(201).json({ message: 'Admin user seeded successfully' });
  } catch (error) {
    console.error('Error seeding admin user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
})


app.listen(port, () => {
  console.log(`Server is running at ${path}:${port}`);
})