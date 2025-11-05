const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const User = require('../models/User');

// Authenticate user token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    console.log('🔐 Authentication check:', {
      hasAuthHeader: !!authHeader,
      hasToken: !!token,
      endpoint: req.path
    });

    if (!token) {
      return res.status(401).json({
        error: true,
        message: 'Access token required'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    console.log('✅ Token verified. User ID:', decoded.id);
    
    // Get user from database
    const user = await User.findById(decoded.id);
    if (!user) {
      console.error('❌ User not found in database for ID:', decoded.id);
      return res.status(401).json({
        error: true,
        message: 'Invalid token - user not found'
      });
    }

    console.log('✅ User found:', {
      id: user.id,
      email: user.email,
      isActive: user.isActive
    });

    // Check if user is active
    if (!user.isActive) {
      console.error('❌ User account is deactivated:', user.id);
      return res.status(401).json({
        error: true,
        message: 'Account is deactivated'
      });
    }

    req.user = user.toJSON();
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: true,
        message: 'Token has expired'
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: true,
        message: 'Invalid token'
      });
    }

    console.error('Authentication error:', error);
    return res.status(500).json({
      error: true,
      message: 'Authentication error'
    });
  }
};

// Authenticate admin token
const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: true,
        message: 'Access token required'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    
    // Get admin from database
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({
        error: true,
        message: 'Invalid token - admin not found'
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({
        error: true,
        message: 'Account is deactivated'
      });
    }

    req.admin = admin.toAuthJSON();
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: true,
        message: 'Token has expired'
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: true,
        message: 'Invalid token'
      });
    }

    console.error('Admin authentication error:', error);
    return res.status(500).json({
      error: true,
      message: 'Authentication error'
    });
  }
};

// Check admin role
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        error: true,
        message: 'Admin authentication required'
      });
    }

    const userRole = req.admin.role;
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        error: true,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Check admin permission
const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({
        error: true,
        message: 'Admin authentication required'
      });
    }

    const admin = new Admin(req.admin);
    if (!admin.hasPermission(permission)) {
      return res.status(403).json({
        error: true,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authenticateAdmin,
  requireRole,
  requirePermission
};
