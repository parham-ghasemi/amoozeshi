const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection failed:', err));

// Routes
const authRoutes = require('./routes/auth.routes');
app.use('/auth', authRoutes);

const articleRoutes = require('./routes/article.routes');
app.use('/', articleRoutes);

const videoRoutes = require('./routes/video.routes');
app.use('/', videoRoutes);

const courseRoutes = require('./routes/course.routes');
app.use('/', courseRoutes);

const visitRoutes = require('./routes/visit.routes');
app.use('/', visitRoutes);

const categoryRoutes = require('./routes/category.routes')
app.use('/', categoryRoutes);


// Serve /uploads folder
const uploadPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadPath));
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);



// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
