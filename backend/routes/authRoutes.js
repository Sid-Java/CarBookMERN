const router = require('express').Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../models/VerifyToken');
const sendEmail = require('../utils/sendEmail');
const { registrationEmail } = require('../utils/emailTemplates');

// Input validation middleware
const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }
  
  next();
};

const validateRegisterInput = (req, res, next) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  if (name.length < 2) {
    return res.status(400).json({ error: 'Name must be at least 2 characters long' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }
  
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email' });
  }
  
  next();
};

// Generate tokens
const generateTokens = (user) => {
  if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT secrets not configured');
  }

  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, // Fallback to JWT_SECRET if refresh secret is not set
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};

// Register new user
router.post('/register', validateRegisterInput, async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Create new user
    const user = new User({ name, email, password });
    await user.save();
    
    // Send welcome email
    try {
      const { subject, html } = registrationEmail(name);
      await sendEmail(email, subject, html);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't return error to client, registration was successful
    }
    
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login user
router.post('/login', validateLoginInput, async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Generate tokens
    console.log('Generating tokens for user:', email);
    const { accessToken, refreshToken } = generateTokens(user);
    
    // Update user's refresh token and last login
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();
    
    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    console.log('Login successful for user:', email);
    res.json({
      user: user.toJSON(),
      token: accessToken
    });
  } catch (error) {
    console.error('Login error details:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// Refresh token
router.post('/refresh-token', async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  
  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }
  
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    // Find user and verify refresh token
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    
    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
    
    // Update user's refresh token
    user.refreshToken = newRefreshToken;
    await user.save();
    
    // Set new refresh token in cookie
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    
    res.json({ token: accessToken });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// Logout
router.post('/logout', verifyToken, async (req, res) => {
  try {
    // Clear user's refresh token
    const user = await User.findById(req.user.id);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
    
    // Clear refresh token cookie
    res.clearCookie('refreshToken');
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// Get current user
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user info' });
  }
});

module.exports = router;