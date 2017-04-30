const ensureIsAdmin = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    if (req.session) {
      req.session.returnTo = req.originalUrl || req.url;
    }
    return res.redirect('/auth');
  }

  if (!req.user.isAdmin) {
    return next(new Error('Not admin'));
  }

  return next();
};

module.exports = ensureIsAdmin;
