module.exports = {
  ensureAuthenticated: function(req, res, next) {
    //User is logged in
    if (req.isAuthenticated()) {
      return next();
    }

    //display error msg is not logged in
    req.flash('error_msg', 'Not Authorized');
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
