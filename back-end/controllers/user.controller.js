const User = require("../models/User");
const Course = require("../models/Course");
const Video = require("../models/Video");
const Article = require("../models/Article");


exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id; // from the JWT payload

    const user = await User.findById(userId)
      .select("-hashedPassword") // exclude sensitive info
      .populate("favoriteCourses", "title thumbnail")
      .populate("joinedCourses", "title thumbnail")
      .populate("favoriteVideos", "title thumbnail visits createdAt")
      .populate("favoriteArticles", "title thumbnail");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error("Error getting current user:", err);
    return res.status(500).json({ message: "Server error." });
  }
};

const toggleFavorite = async (req, res, model, field) => {
  try {
    const userId = req.user.id;
    const itemId = req.params.id;

    const user = await User.findById(userId);
    const exists = await model.findById(itemId);
    if (!exists) return res.status(404).json({ message: `${model.modelName} not found` });

    const alreadyFavorite = user[field].includes(itemId);
    if (alreadyFavorite) {
      user[field] = user[field].filter(id => id.toString() !== itemId);
    } else {
      user[field].push(itemId);
    }

    await user.save();
    res.status(200).json({ 
      message: `${model.modelName} ${alreadyFavorite ? 'removed from' : 'added to'} favorites`,
      [field]: user[field] 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.toggleFavoriteCourse = (req, res) =>
  toggleFavorite(req, res, Course, "favoriteCourses");

exports.toggleFavoriteVideo = (req, res) =>
  toggleFavorite(req, res, Video, "favoriteVideos");

exports.toggleFavoriteArticle = (req, res) =>
  toggleFavorite(req, res, Article, "favoriteArticles");