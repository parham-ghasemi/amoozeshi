const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');

exports.login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await Admin.findOne({ userName });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    return res.status(200).json({ message: 'Login success!' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.seed = async (req, res) => {
  try {
    await Admin.deleteMany({});
    const hashedPassword = await bcrypt.hash('123', 10);

    const testUser = new Admin({
      userName: 'test',
      phoneNumber: 123456789,
      hashedPassword,
    });

    await testUser.save();

    res.status(201).json({ message: 'Seeded test user successfully' });
  } catch (err) {
    console.error('Seeding error:', err);
    res.status(500).json({ message: 'Failed to seed test user' });
  }
};
