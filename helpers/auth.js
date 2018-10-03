module.exports = {
  ensureAuthenticated: function(req, res, next) {
    //User is logged in
    if (req.isAuthenticated()) {
      return next();
    }

    res.redirect('/auth/login');
  },
  ensureGuest: function(req, res, next) {
    //The viewer is a guest
    if (req.isAuthenticated()) {
      res.redirect('/');
    } else {
      return next();
    }
  }
};
