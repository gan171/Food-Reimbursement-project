export const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  return next();
};

export const requireRoles = (...roles) => (req, res, next) => {
  if (!req.session.user || !roles.includes(req.session.user.role)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  return next();
};
