import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: "Forbidden: Access denied" });
    }
    next();
  };
};

import User from '../modules/user/user.model.js';

export const checkSchoolAccess = async (req, res, next) => {
  // If user is superadmin, they can access everything
  if (req.user.role === 'superadmin') {
    return next();
  }

  // If schooladmin, they must have a schoolId and it must be used for filtering
  if (req.user.role === 'schooladmin') {
    let schoolId = req.user.schoolId;

    // If token doesn't have schoolId, fetch from DB to see if they just created it
    if (!schoolId) {
      const user = await User.findByPk(req.user.id);
      if (user && user.schoolId) {
        schoolId = user.schoolId;
        req.user.schoolId = schoolId; // Update in request context
      }
    }

    if (!schoolId) {
      return res.status(403).json({ success: false, message: "School not setup yet" });
    }
    
    req.schoolId = schoolId;
    next();
  } else {
    res.status(403).json({ success: false, message: "Access denied" });
  }
};

