module.exports = {
  ensureAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/users/login');
  },
  forwardAuthenticated: function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    next();
  },
  adminAuthenticated: function(req, res, next) {
    if (req.isAuthenticated()) {
      if (req.user.role == 'admin') {
        return next();
      } else {
        res.redirect('/mypage');
      }
    }}
};
