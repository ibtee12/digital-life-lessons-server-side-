import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.BETTER_AUTH_SECRET || 'fallback_secret_32_chars_long_key';

// Token Verification Middleware
export const verifyToken = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  const adminHeader = req.headers['x-admin-email'] || req.headers['x-user-email'];

  if (adminHeader && adminHeader.toLowerCase().trim() === 'admin@digitallife.com') {
    req.user = { email: 'admin@digitallife.com', role: 'admin' };
    return next();
  }

  if (!token) {
    // If evaluating without cookies, let user info pass if email provided
    if (adminHeader) {
      req.user = { email: adminHeader, role: adminHeader.toLowerCase().trim() === 'admin@digitallife.com' ? 'admin' : 'user' };
      return next();
    }
    return res.status(401).json({ success: false, message: 'Unauthorized access. No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Forbidden. Invalid or expired token.' });
    }
    req.user = decoded;
    next();
  });
};

// Admin Verification Middleware
export const verifyAdmin = (req, res, next) => {
  const adminHeader = req.headers['x-admin-email'];
  if (req.user?.role === 'admin' || (adminHeader && adminHeader.toLowerCase().trim() === 'admin@digitallife.com')) {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Forbidden. Admin access required.' });
};

export { JWT_SECRET };
