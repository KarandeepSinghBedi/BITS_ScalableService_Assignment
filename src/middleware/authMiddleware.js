const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

const allowOnlyUsers = (req, res, next) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({ message: 'Only regular users can place orders' });
  }
  next();
};


module.exports = { protect, isSuperAdmin, allowOnlyUsers };
