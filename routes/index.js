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
  const sql = 'SELECT * FROM allGoods';
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
    const sql = 'SELECT * FROM allGoods WHERE id = ' + req.params.id;
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

// Admin
router.get('/admin', (req, res) => {

  const sql = 'SELECT * FROM allGoods';
  db.query(sql, (err, data) => {
    if (err) throw err;
    var currentData = (item => {
      return data;
    });
    if (req.query.id != undefined) {
      const sql = 'DELETE FROM allGoods WHERE id = ' + req.query.id;
      db.query(sql, (err, data) => {
        if (err) throw err;
        currentMessage = '1 record deleted';
        res.redirect("back");

      });
    } else {
      res.render("admin", {
        currentData: data,
        user: req.user
      })
    }
  })
});

router.post("/admin", urlencodedParser, (req, res) => {
  console.log(req.body);

  if (!req.files || Object.keys(req.files).length === 0) {
    var newGood = {
      id: req.body.id,
      name: req.body.name,
      category: req.body.category,
      cost: req.body.cost,
      image: 'no_img.png',
      quantity: req.body.quantity,
      description: req.body.descr,
    }
  } else {
    var newFile = req.files.img_name;
    newFile.mv('./public/img/' + newFile.name, (err) => {
      if (err) return res.status(500).send(err);
    })
    newGood = {
      id: req.body.id,
      name: req.body.name,
      category: req.body.category,
      cost: req.body.cost,
      image: newFile.name,
      quantityAll: req.body.quantity,
      description: req.body.descr,
    }
  }
  const sql = 'INSERT INTO allGoods SET ?';
  db.query(sql, newGood, (err, result) => {
    if (err) throw err;
    currentMessage = '1 record inserted';
    res.redirect("back");
    // });
  });
});

//User page
router.get('/mypage', (req, res) =>
  res.render('mypage', {
    user: req.user
  })
);

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
