// In-memory API Rate Limiter Middleware
const requestCounts = new Map();

export const rateLimiter = (options = {}) => {
  const windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes default
  const max = options.max || 100; // 100 requests per window
  const message = options.message || 'Too many requests from this IP. Please try again later.';

  return (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown-ip';
    const now = Date.now();

    let clientData = requestCounts.get(ip);

    if (!clientData || now - clientData.startTime > windowMs) {
      clientData = {
        count: 1,
        startTime: now
      };
      requestCounts.set(ip, clientData);
      return next();
    }

    clientData.count += 1;

    if (clientData.count > max) {
      const retryAfterSeconds = Math.ceil((clientData.startTime + windowMs - now) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      return res.status(429).json({
        success: false,
        message,
        retryAfter: `${retryAfterSeconds}s`
      });
    }

    next();
  };
};

// Strict rate limiter for Auth endpoints (Login & Register)
export const authRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.'
});
