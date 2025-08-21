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
const articleRoutes = require('./routes/article.routes');
const videoRoutes = require('./routes/video.routes');
const podcastRoutes = require('./routes/podcast.routes');
const courseRoutes = require('./routes/course.routes');
const visitRoutes = require('./routes/visit.routes');
const categoryRoutes = require('./routes/category.routes');
const userRoutes = require('./routes/user.routes');
const homePageRoutes = require('./routes/homepage.routes');

const routers = [
  { path: '/api/auth', router: authRoutes },
  { path: '/api', router: articleRoutes },
  { path: '/api', router: videoRoutes },
  { path: '/api', router: podcastRoutes },
  { path: '/api', router: courseRoutes },
  { path: '/api', router: visitRoutes },
  { path: '/api', router: categoryRoutes },
  { path: '/api', router: userRoutes },
  { path: '/api', router: homePageRoutes },
];

// Validate and use routers
routers.forEach(r => {
  if (!r.router || typeof r.router !== 'function' || !r.router.stack) {
    console.error('Invalid router detected for path', r.path, r.router);
  } else {
    app.use(r.path, r.router);
  }
});

// Serve React frontend
app.use(express.static(path.join(__dirname, "client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

// Serve /uploads folder
const uploadPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadPath));
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running at http://0.0.0.0:${port}`);
});
