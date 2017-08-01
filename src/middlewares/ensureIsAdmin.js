import errors from 'throw.js';

const ensureIsAdmin = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    if (req.session) {
      req.session.returnTo = req.originalUrl || req.url;
    }
    return res.redirect('/auth');
  }

  if (!req.user.isAdmin) {
    return next(new errors.CustomError('AdminOnly', 'Admin permission is required.'));
  }

  return next();
};

module.exports = ensureIsAdmin;
