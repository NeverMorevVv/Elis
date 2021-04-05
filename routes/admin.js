const express = require('express');
const router = express.Router();
const db = require('../db');
const mysql = require('mysql');
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({
  extended: false
});

// Admin
router.get('/admin', (req, res) => {
  if (req.session.passport) {
    if (req.session.passport.user !== undefined) {
      const sql = 'SELECT role from users WHERE id = ?';
      db.query(sql, req.session.passport.user, (err, data) => {
        if (data[0].role === "admin") {
          //
          const sql = 'SELECT * FROM all_goods';
          db.query(sql, (err, data) => {
            if (err) throw err;
            // var currentData = (item => {
            //   return data;
             var currentData = data;
            // });
            const sql = 'SELECT * FROM new_orders';
            db.query(sql, (err, data) => {

              if (err) throw err;
              var ordersInfo = data;
              if (req.query.item_id != undefined) {
                const sql = 'DELETE FROM all_goods WHERE id = ' + req.query.item_id;
                db.query(sql, (err, data) => {

                  if (err) throw err;
                  currentMessage = '1 record deleted';
                  res.redirect("back");
                });
              } else {
                res.render('admin', {
                  isAuthenticated: req.isAuthenticated(),
                  currentData: currentData,
                  ordersInfo: ordersInfo,
                  user: req.user
                });
              }
            });
          });
        } else {
          admin = "";
          res.redirect('/');
        }
      });
    } else {
      res.redirect('/login');
    }
  } else {
    res.redirect('/login');
  }
});

router.post("/admin", urlencodedParser, (req, res) => {
  console.log(req.body);

  if (!req.files || Object.keys(req.files).length === 0) {
    var newGood = {
      id: req.body.item_id,
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
      id: req.body.item_id,
      name: req.body.name,
      category: req.body.category,
      cost: req.body.cost,
      image: newFile.name,
      quantityAll: req.body.quantity,
      description: req.body.descr,
    }
  }
  const sql = 'INSERT INTO all_goods SET ?';
  db.query(sql, newGood, (err, result) => {
    if (err) throw err;
    currentMessage = '1 record inserted';
    res.redirect("back");
    // });
  });
});

module.exports = router;
