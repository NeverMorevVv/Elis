const express = require('express');
const router = express.Router();
const passport = require('passport');

router.post('/login', (req, res, next) => {
  passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next);
});
//

router.post('/signup',
  passport.authenticate('local-signup', {
    failureRedirect: '/register',
    failureFlash: true
  }), (req, res) => {

    res.redirect('/');
  });

  // Logout
  router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  });

module.exports = router;
