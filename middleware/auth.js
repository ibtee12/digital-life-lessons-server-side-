import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.BETTER_AUTH_SECRET || 'fallback_secret_32_chars_long_key';

// Token Verification Middleware
export const verifyToken = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
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
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Forbidden. Admin access required.' });
  }
  next();
};

export { JWT_SECRET };
