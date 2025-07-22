// backend/models/VerifyToken.js
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./User');

const verifySchema = new mongoose.Schema({
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  token:    String,
  expires:  Date
});

// Verify JWT token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

// Verify admin role middleware
const verifyAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
  next();
};

// Verify token and refresh if needed
const verifyAndRefreshToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const refreshToken = req.cookies?.refreshToken;

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError' && refreshToken) {
      try {
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        
        // Find user and verify refresh token
        const user = await User.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken) {
          return res.status(401).json({ error: 'Invalid refresh token.' });
        }

        // Generate new access token
        const newToken = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: '15m' }
        );

        // Set new access token in response header
        res.setHeader('Authorization', `Bearer ${newToken}`);
        
        req.user = decoded;
        next();
      } catch (refreshError) {
        return res.status(401).json({ error: 'Invalid refresh token.' });
      }
    } else {
      return res.status(401).json({ error: 'Invalid token.' });
    }
  }
};

module.exports = {
  verifyToken,
  verifyAdmin,
  verifyAndRefreshToken
};
