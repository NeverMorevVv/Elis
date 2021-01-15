const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const db = require('../db');
const mysql = require('mysql');
const crypto = require('crypto');
//
function sha512(data) {
  return crypto.createHash('sha512').update(data, 'utf-8').digest('hex');
}
//
module.exports = function(passport) {
passport.use(
  "local-signup",
  new Strategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
      password = sha512(password);

      // Find a user whose username is the same as the forms username
      // Check to see if the user trying to login already exists

      db.query(
        "select * from users where email = ?", [email], (err, rows) => {
          if (err) return done(err);
          if (false) {
            return done(
              null,
              false,
              { message: 'Имя пользователя занято' }
            );
          } else if (req.body.password != req.body.password2) {
            return done(
            null,
            false,
            { message: 'Пароли должны совпадать' }
          )} else {
            // Create the user if there is no user with that username
            var newUserMysql = new Object();
            let role = "";

            newUserMysql.email = email;
            newUserMysql.password = password; // use the generateHash function in our user model
            newUserMysql.role = role;

            let insertQuery = "INSERT INTO users (email, password, role) VALUES (?)";
            // let insertQuery = "INSERT INTO users (email, password, role) VALUES ('"+email+"','"+password+"','"+role+"')"
            //
            let values = [email,password,role];

            db.query(insertQuery, [values], (err, res) => {
              if (err) return done(err);
              else {
                newUserMysql.id = res.insertId;
                return done(null, newUserMysql)
              }
            });
          }
        }
      );
    }
  )
);

// MySQL User Login via named 'local-login 'strategy
passport.use(
  "local-login",
  new Strategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    function(req, email, password, done) {
      db.query(
        "SELECT * FROM  users WHERE email = '" + email + "'",
        function(err, rows) {
          if (err) return done(err);
          if (!rows.length) {
            return done(
              null,
              false,
              { message: 'Неверное имя пользователя или пароль' }
            );
          }
          password = sha512(password);
          if (!(rows[0].password == password)) {
            return done(
              null,
              false,
              { message: 'Неверное имя пользователя или пароль' }
            );
          }
          return done(null, rows[0]);
        }
      );
    }
  )
);
};
//
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// Deserialize the user
passport.deserializeUser(function(id, done) {
  db.query("select * from users where id = " + id, function(
    err,
    rows
  ) {
    done(err, rows[0]);
  });
});
