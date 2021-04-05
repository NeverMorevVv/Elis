const express = require('express');
const router = express.Router();
const passport = require('passport');
const db = require('../db');
const mysql = require('mysql');
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({
  extended: false
});

router.get('/order', urlencodedParser, (req, res, next) => {
  console.log(req.session);
  if (req.session.cart != undefined && req.session.cart.length > 0) {
    const quantity = req.session.cart;
    newArr = []
    const sql = 'SELECT * FROM all_goods WHERE id IN(\'' + req.session.cart.map(i => i.id).join("','") + '\')';
    db.query(sql, (err, result) => {
      if (err) throw err;
      for (var i = 0; i < result.length; i++) {
        for (var z = 0; z < quantity.length; z++) {
          if (result[i].id == quantity[z].id) {
            result[i].quantity = quantity[z].quantity;
            newArr.push(result[i])
          }
        }
      }

      res.render('order', {
        user: req.user,
        data: newArr
      })
    })
  } else {
    res.render('mycart_empty', {
      user: req.user
    })
  }
});

router.post('/order', urlencodedParser, (req, res, next) => {
  if (req.session.passport) {
    if (req.session.passport.user !== undefined) {
      var user = req.session.passport.user
    }
  } else {
    var user = '';
  }
  var today = new Date().toLocaleDateString()

  newOrder = {
    idSession: req.session.id,
    name: req.body.name,
    adress: req.body.adress,
    phone: req.body.phone,
    comment: req.body.comment,
    user_id: user,
    date: today
  }

  const sql = 'INSERT INTO new_orders  SET ?';
  db.query(sql, newOrder, (err, result) => {
    if (err) throw err;
    console.log('id =', result.insertId, ' record inserted in new_orders');

    goods = []
    for (var i = 0; i < req.session.cart.length; i++) {
      orderCluster = {
        idOrders: result.insertId,
        idGoods: req.session.cart[i].id,
        countGoods: req.session.cart[i].quantity,
        idUser: user
      }
      goods.push(orderCluster);
    }
    const sql = 'INSERT INTO order_goods (idOrders, idGoods, countGoods) VALUES ?';
    db.query(sql, [goods.map(item => [item.idOrders, item.idGoods, item.countGoods])], (err, result) => {
      if (err) throw err;
      console.log('record inserted in order_goods');
    })
    res.render('sucsess', {
      user: req.user
    })
  })
});

module.exports = router;
