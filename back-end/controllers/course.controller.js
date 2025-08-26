const mongoose = require('mongoose');
const Course = require('../models/Course');
const Category = require('../models/Category');
const { User } = require('../models/User');

// === Add a new course ===
exports.addCourse = async (req, res) => {
  try {
    const {
      title,
      shortDesc,
      thumbnail,
      longDesc,
      category,
      time,
      level,
      goal,
      topics,
      questions,
      content,
      related = [],
    } = req.body;

    if (
      !title || !shortDesc || !thumbnail || !longDesc || !category ||
      !time || !level || !goal || !topics || !questions || !content
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // ✅ Validate category
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    const parsedTopics = typeof topics === 'string' ? JSON.parse(topics) : topics;
    const parsedQuestions = typeof questions === 'string' ? JSON.parse(questions) : questions;
    const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
    const parsedRelated = Array.isArray(related)
      ? related.map(id => new mongoose.Types.ObjectId(id))
      : [];
    const parsedLongDesc = typeof longDesc === 'string' ? JSON.parse(longDesc) : longDesc;

    const parsedContentWithObjectIds = parsedContent.map(item => ({
      itemId: new mongoose.Types.ObjectId(item.itemId),
      itemType: item.itemType,
    }));

    const newCourse = new Course({
      title,
      shortDesc,
      thumbnail,
      longDesc: parsedLongDesc,
      category,
      time,
      level,
      goal,
      topics: parsedTopics,
      questions: parsedQuestions,
      content: parsedContentWithObjectIds,
      related: parsedRelated,
    });

    await newCourse.save();

    res.status(201).json({ message: 'Course added successfully', course: newCourse });
  } catch (err) {
    console.error('Add course error:', err);
    res.status(500).json({ message: 'Failed to add course' });
  }
};



// === Get all courses (short version) ===
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({}, { _id: 1, title: 1, shortDesc: 1, thumbnail: 1 });
    res.status(200).json(courses);
  } catch (err) {
    console.error('Fetch courses error:', err);
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
};

// === Get course by ID (and increment visits) ===
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('content.itemId')
      .populate('related', '_id title shortDesc thumbnail')
      .populate('category', 'name');

    if (!course) return res.status(404).json({ message: 'Course not found' });

    res.json({ course });
  } catch (err) {
    console.error('Get course by ID error:', err);
    res.status(500).json({ message: 'Failed to fetch course' });
  }
};


exports.getCourseContentById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('content.itemId')
      .populate('related', '_id title shortDesc thumbnail');

    if (!course) return res.status(404).json({ message: 'course not foudn' });

    res.json({ content: course.content, title: course.title })
  } catch (err) {
    console.error('Get course content by ID error:', err);
    res.status(500).json({ message: 'Failed to fetch course content' });
  }
}

// === Get courses by category (short version) ===
exports.getCoursesByCategory = async (req, res) => {
  const { category } = req.params;

  if (!mongoose.Types.ObjectId.isValid(category)) {
    return res.status(400).json({ message: 'Invalid category ID' });
  }

  try {
    const courses = await Course.find(
      { category: new mongoose.Types.ObjectId(category) },
      { _id: 1, title: 1, shortDesc: 1, thumbnail: 1 }
    );

    res.status(200).json(courses);
  } catch (err) {
    console.error('Fetch category courses error:', err);
    res.status(500).json({ message: 'Failed to fetch category courses' });
  }
};


// === Get newest courses (short version) ===
exports.getNewestCourses = async (req, res) => {
  try {
    const courses = await Course.find({}, { _id: 1, title: 1, shortDesc: 1, thumbnail: 1 })
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json(courses);
  } catch (err) {
    console.error('Fetch newest courses error:', err);
    res.status(500).json({ message: 'Failed to fetch newest courses' });
  }
};

exports.getMostPopularCourses = async (req, res) => {
  try {
    const mostPopular = await Course.find({}, { title: 1, shortDesc: 1, thumbnail: 1 })
      .sort({ joinedBy: -1 }).limit(20);

    if (!mostPopular) {
      return res.status(404).json({ message: "No courses found" });
    }

    res.status(200).json(mostPopular);
  } catch (err) {
    console.error("Error getting most popular course:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// === Search courses by title or shortDesc (short version) ===
exports.searchCourses = async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ error: 'Query parameter is required' });

  try {
    const results = await Course.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { shortDesc: { $regex: query, $options: 'i' } },
      ],
    }, { _id: 1, title: 1, shortDesc: 1, thumbnail: 1 });

    res.json(results);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.joinCourse = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // Check if user already joined the course
    if (course.joinedBy.includes(userId)) {
      return res.status(400).json({ message: "Already joined" });
    }

    // Add user to course's joinedBy
    course.joinedBy.push(userId);
    await course.save();

    // Add course to user's joinedCourses
    await User.findByIdAndUpdate(userId, {
      $addToSet: { joinedCourses: courseId } // ensures no duplicates
    });

    res.json({ message: "Successfully joined course" });
  } catch (err) {
    console.error('error joining course:', err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.checkIsJoined = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id: courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const isJoined = course.joinedBy?.some(id => id.equals(userId)) || false;

    res.json({ isJoined });
  } catch (err) {
    console.error("error checking if the user is joined", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.editCourse = async (req, res) => {
  try {
    const courseId = req.params.id;

    // Validate course ID
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: 'Invalid course ID' });
    }

    // Find existing course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Destructure fields from request body
    const {
      title,
      shortDesc,
      thumbnail,
      longDesc,
      category,
      time,
      level,
      goal,
      topics,
      questions,
      content,
      related,
    } = req.body;

    // Validate required fields (you can adjust as needed)
    if (
      !title || !shortDesc || !thumbnail || !longDesc || !category ||
      !time || !level || !goal || !topics || !questions || !content
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }

    // Parse fields if passed as JSON strings
    const parsedTopics = typeof topics === 'string' ? JSON.parse(topics) : topics;
    const parsedQuestions = typeof questions === 'string' ? JSON.parse(questions) : questions;
    const parsedContent = typeof content === 'string' ? JSON.parse(content) : content;
    const parsedRelated = Array.isArray(related)
      ? related.map(id => new mongoose.Types.ObjectId(id))
      : [];

    const parsedLongDesc = typeof longDesc === 'string' ? JSON.parse(longDesc) : longDesc;

    const parsedContentWithObjectIds = parsedContent.map(item => ({
      itemId: new mongoose.Types.ObjectId(item.itemId),
      itemType: item.itemType,
    }));

    // Update fields
    course.title = title;
    course.shortDesc = shortDesc;
    course.thumbnail = thumbnail;
    course.longDesc = parsedLongDesc;
    course.category = category;
    course.time = time;
    course.level = level;
    course.goal = goal;
    course.topics = parsedTopics;
    course.questions = parsedQuestions;
    course.content = parsedContentWithObjectIds;
    course.related = parsedRelated;

    await course.save();

    res.json({ message: 'Course updated successfully', course });
  } catch (err) {
    console.error('Edit course error:', err);
    res.status(500).json({ message: 'Failed to update course' });
  }
};
