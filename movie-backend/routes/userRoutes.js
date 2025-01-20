const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/userSchema');
const router = express.Router();

// User Registration Endpoint
router.post('/register', async (req, res) => {
  const { name, email, phone, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, phone, password: hashedPassword });

  try {
    await newUser.save();
    res.status(200).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error registering user', error });
  }
});

// User Login Endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ success: false, message: 'User not found' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ success: false, message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });

  res.json({
    success: true,
    token,
    user: {
      userid: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone, // You can add more fields if needed
    },
  });
});

module.exports = router;
