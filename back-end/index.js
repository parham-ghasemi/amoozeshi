const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const { SitemapStream, streamToPromise } = require('sitemap'); // For sitemap
const zlib = require('zlib');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { StaticRouter } = require('react-router-dom/server'); // For SSR with React Router
require('dotenv').config();

// Import your React App (assumes compiled CommonJS module)
const App = require('../front-end/dist/assets/App'); // Adjust path to your compiled App.js

// Import MongoDB models (adjust paths/names to match your setup)
const Article = require('./models/Article');
const Course = require('./models/Course');
const Video = require('./models/Video');
const Podcast = require('./models/Podcast');

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
const footerRoutes = require('./routes/footer.routes');
const resumeRoutes = require('./routes/resume.routes');

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
  { path: '/api', router: footerRoutes },
  { path: '/api', router: resumeRoutes },
];

// Validate and use routers
routers.forEach(r => {
  if (!r.router || typeof r.router !== 'function' || !r.router.stack) {
    console.error('Invalid router detected for path', r.path, r.router);
  } else {
    app.use(r.path, r.router);
  }
});

// Serve robots.txt
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`
    User-agent: *
    Allow: /
    Disallow: /admin/
    Disallow: /auth/
    Disallow: /profile/
    Sitemap: https://modirfarda.com/sitemap.xml
  `);
});

// Serve sitemap.xml (dynamic with MongoDB queries)
let cachedSitemap; // Cache to avoid regenerating on every request
app.get('/sitemap.xml', async (req, res) => {
  res.header('Content-Type', 'application/xml');
  res.header('Content-Encoding', 'gzip');

  if (cachedSitemap) return res.send(cachedSitemap);

  try {
    const smStream = new SitemapStream({ hostname: 'https://yourdomain.com/' });
    const pipeline = smStream.pipe(zlib.createGzip());

    // Static routes (public only, based on your App.tsx)
    const staticUrls = [
      { url: '/', changefreq: 'daily', priority: 1.0 },
      { url: '/about', changefreq: 'monthly', priority: 0.8 },
      { url: '/articles', changefreq: 'weekly', priority: 0.9 },
      { url: '/articles/results', changefreq: 'weekly', priority: 0.7 },
      { url: '/articles-all', changefreq: 'weekly', priority: 0.8 },
      { url: '/courses', changefreq: 'weekly', priority: 0.9 },
      { url: '/courses-all', changefreq: 'weekly', priority: 0.8 },
      { url: '/courses/search', changefreq: 'weekly', priority: 0.7 },
      { url: '/videos', changefreq: 'weekly', priority: 0.9 },
      { url: '/videos/search', changefreq: 'weekly', priority: 0.7 },
      { url: '/videos-all', changefreq: 'weekly', priority: 0.8 },
      { url: '/podcasts', changefreq: 'weekly', priority: 0.9 },
      { url: '/podcasts/search', changefreq: 'weekly', priority: 0.7 },
    ];

    staticUrls.forEach((item) => smStream.write({ ...item, lastmod: new Date().toISOString() }));

    // Dynamic routes: Query MongoDB
    const articles = await Article.find().select('_id updatedAt'); // Adjust field if using slugs
    articles.forEach((art) => smStream.write({
      url: `/article/${art._id}`,
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: art.updatedAt ? art.updatedAt.toISOString() : new Date().toISOString(),
    }));

    const courses = await Course.find().select('_id updatedAt');
    courses.forEach((course) => {
      smStream.write({
        url: `/course/${course._id}`,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: course.updatedAt ? course.updatedAt.toISOString() : new Date().toISOString(),
      });
      smStream.write({
        url: `/course/${course._id}/content`,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: course.updatedAt ? course.updatedAt.toISOString() : new Date().toISOString(),
      });
    });

    const videos = await Video.find().select('_id updatedAt');
    videos.forEach((vid) => smStream.write({
      url: `/video/${vid._id}`,
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: vid.updatedAt ? vid.updatedAt.toISOString() : new Date().toISOString(),
    }));

    const podcasts = await Podcast.find().select('_id updatedAt');
    podcasts.forEach((pod) => smStream.write({
      url: `/podcast/${pod._id}`,
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: pod.updatedAt ? pod.updatedAt.toISOString() : new Date().toISOString(),
    }));

    smStream.end();
    cachedSitemap = await streamToPromise(pipeline);
    pipeline.pipe(res).on('error', (e) => { throw e; });
  } catch (err) {
    console.error('Sitemap error:', err);
    res.status(500).end();
  }
});

// Serve React frontend with SSR for crawlers
app.use(express.static(path.join(__dirname, "../front-end/dist")));

app.get(/^\/(?!api\/|uploads\/|robots\.txt|sitemap\.xml).*/, (req, res) => {
  const context = {};
  const appHtml = ReactDOMServer.renderToString(
    <StaticRouter location={req.url} context={context}>
      <App.default /> {/* Adjust if your App export isn't 'default' */}
    </StaticRouter>
  );

  if (context.url) {
    // Handle redirects if React Router sets context.url
    res.redirect(301, context.url);
  } else {
    // Send HTML with server-rendered content
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Modirfarda</title>
          <!-- Meta tags will be injected by react-helmet in App -->
          <link rel="stylesheet" href="/assets/index.css"> <!-- Adjust if your CSS path differs -->
        </head>
        <body>
          <div id="root">${appHtml}</div>
          <script src="/assets/index.js"></script> <!-- Your React bundle -->
        </body>
      </html>
    `);
  }
});

// Serve /uploads folder
const uploadPath = path.join(__dirname, 'uploads');
app.use('/uploads', express.static.uploadPath);
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://0.0.0.0:${port}`);
});