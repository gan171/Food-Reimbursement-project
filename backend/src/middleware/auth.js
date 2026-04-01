import { normalizeRole } from '../utils/roles.js';

export const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  return next();
};

export const requireRoles = (...roles) => (req, res, next) => {
  const role = normalizeRole(req.session.user?.role);
  if (!req.session.user || !roles.includes(role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }

  req.session.user.role = role;
  return next();
};
