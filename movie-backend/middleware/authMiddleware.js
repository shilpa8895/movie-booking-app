const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, 'secretKey');
    req.user = decoded.userId; // Add the user ID to the request object
    next(); // Call the next middleware or route handler
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token, authorization denied' });
  }
};

module.exports = authenticateUser;
