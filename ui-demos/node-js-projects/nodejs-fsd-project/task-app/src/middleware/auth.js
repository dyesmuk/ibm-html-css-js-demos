// ============================================================
// MODULE 11 — Authentication & Security
// middleware/auth.js
//
// JWT authentication middleware.
// - Extracts Bearer token from Authorization header
// - Verifies signature and expiry with jwt.verify()
// - Checks that the token still exists in the user's tokens[]
//   array (supports per-device logout / revocation)
// - Attaches req.user and req.token for downstream use
// ============================================================

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Token must still be in the user's active token list
    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token,
    });

    if (!user) {
      return res.status(401).json({ error: 'Please authenticate' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

export default requireAuth;
