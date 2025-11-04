import jwt from "jsonwebtoken";

// Simple JWT middleware for demo purposes
// In production, use Auth0 SDK or proper JWT verification
export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      // For demo purposes, allow access without token
      console.log("⚠️  No auth token provided - continuing anyway (demo mode)");
      req.user = { id: 'demo-user', email: 'demo@openaichain.com' };
      return next();
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'demo-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    console.log("⚠️  Auth verification failed - continuing anyway (demo mode)");
    req.user = { id: 'demo-user', email: 'demo@openaichain.com' };
    next();
  }
};

// Optional middleware - only warns if no auth
export const optionalAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'demo-secret-key');
      req.user = decoded;
    }
  } catch (error) {
    // Silent fail for optional auth
  }
  next();
};
