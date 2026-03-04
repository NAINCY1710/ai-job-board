import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Check if user is logged in
export const protect = async (req, res, next) => {
  try {
    // Get token from request header
    let token = req.headers.authorization?.split(' ')[1];

    // If no token found
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user from decoded token's ID
    req.user = await User.findById(decoded.id).select('-password');

    // Move to next function
    next();

  } catch (error) {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};

// Check if user is a recruiter
export const recruiterOnly = (req, res, next) => {
  if (req.user?.role !== 'recruiter') {
    return res.status(403).json({ message: 'Recruiter access only' });
  }
  next();
};


