const User = require("../models/User");

exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id; // from the JWT payload

    const user = await User.findById(userId)
      .select("-hashedPassword") // exclude sensitive info
      .populate("favoriteCourses", "title thumbnail")
      .populate("joinedCourses", "title thumbnail")
      .populate("favoriteVideos", "title thumbnail")
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
