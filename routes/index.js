const express = require('express');
const router = express.Router();
const db = require('../db');
const mysql = require('mysql');
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({
  extended: false
});
const passport = require('passport');



// Welcome Page
router.get('/', (req, res) => res.render('index', {
  user: req.user
}));

// Login Page
router.get('/login', (req, res) => res.render('login'));

// Register Page
router.get('/register', (req, res) => res.render('register'));

// desk
router.get('/desk', (req, res) => {
  const sql = 'SELECT * FROM all_goods';
  db.query(sql, (err, data) => {
    if (err) throw err;
    res.render("desk", {
      baseArr: data,
      user: req.user
    });
  });
});

// Item Page
router.get("/:id", (req, res, next) => {
  if (!isNaN(+req.params.id)) {
    const sql = 'SELECT * FROM all_goods WHERE id = ' + req.params.id;
    db.query(sql, (err, data) => {
      if (err) throw err;
      const lot = data.find(item => {
        return item.id === Number(req.params.id);
      });
      res.render("product", {
        lot: lot,
        user: req.user
      });
    });
  } else {
    next();
  }
});

//User page
router.get('/mypage', (req, res) => {
  const sql = 'SELECT * FROM new_orders WHERE user_id = ' + req.session.passport.user;
  db.query(sql, (err, data) => {
    if (err) throw err;
    res.render('mypage', {
      user: req.user,
      data: data
    })
  });
});

// Dashboard
router.get('/dashboard', (req, res) =>
  res.render('', {
    user: req.user
  })
);

// Blog
router.get('/blog', (req, res) =>
  res.render('blog', {
    user: req.user
  })
);

// Solo blog
router.get('/soloBlog', (req, res) =>
  res.render('soloBlog', {
    user: req.user
  })
);

module.exports = router;
