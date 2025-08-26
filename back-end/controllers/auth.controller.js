const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require('axios');
const { User, OTP } = require("../models/User");


const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.signup = async (req, res) => {
  try {
    const { userName, phoneNumber, password } = req.body;

    // Validate input
    if (!userName || !phoneNumber || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ userName }, { phoneNumber }],
    });
    if (existingUser) {
      return res.status(400).json({ message: "Username or phone number already in use" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);


    // Create user
    const newUser = new User({
      userName,
      phoneNumber,
      hashedPassword,
      isVerified: false,
    });
    await newUser.save(); // Save explicitly to catch validation errors

    // Generate and store OTP
    const otp = generateOTP();
    await OTP.create({
      userId: newUser._id,
      otp,
    });

    const sms = `http://api.payamak-panel.com/post/Send.asmx/SendByBaseNumber2?username=09122153741&password=O#G6N&text=${otp}&to=${phoneNumber}&bodyId=361009`;
    try {
      await axios.get(sms);
    } catch (err) {
      console.error('Error sending the sms', err)
    }

    // Log OTP for testing
    console.log(`OTP for user ${phoneNumber}: ${otp}`);


    res.status(201).json({
      message: "Signup successful, OTP sent",
      user: {
        id: newUser._id,
        userName: newUser.userName,
        phoneNumber: newUser.phoneNumber,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error during signup", error: err.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    // Validate input
    if (!userId || !otp) {
      return res.status(400).json({ message: "User ID and OTP are required" });
    }

    const otpRecord = await OTP.findOne({ userId, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isVerified = true;
    await user.save();

    // Delete used OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "OTP verified successfully",
      token,
      user: {
        id: user._id,
        userName: user.userName,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    console.error("OTP verification error:", err);
    res.status(500).json({ message: "Server error during OTP verification", error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    // Validate input
    if (!phoneNumber || !password) {
      return res.status(400).json({ message: "Phone number and password are required" });
    }

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(400).json({ message: "Invalid phone number or password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your account with OTP" });
    }

    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid phone number or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        userName: user.userName,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login", error: err.message });
  }
};