const express = require('express');
const router = express.Router();
const db = require('../db');
const mysql = require('mysql');
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({
  extended: false
});


router.post("/mycart", urlencodedParser, (req, res) => {
  if (req.rawHeaders.indexOf('Plus') != -1) {
    let plusIdInfo = req.body['"pls'].substr(0, req.body['"pls'].length - 1);
    req.session.cart.find(item => item.id == plusIdInfo).quantity++;
    const qua = req.session.cart.find(item => item.id == plusIdInfo).quantity;
    req.session.save();
    res.send({
      id: plusIdInfo,
      quantity:qua,
     });
  }
  if (req.rawHeaders.indexOf('Minus') != -1) {
    let minusIdInfo = req.body['"mns'].substr(0, req.body['"mns'].length - 1);
    if (req.session.cart.find(item => item.id == minusIdInfo).quantity > 1) {
      req.session.cart.find(item => item.id == minusIdInfo).quantity--;
    }
    const qua = req.session.cart.find(item => item.id == minusIdInfo).quantity;
    res.send({
      id: minusIdInfo,
      quantity:qua,
     });
  }
  if (req.rawHeaders.indexOf('Delete') != -1) {
    let delIdInfo = req.body['"del'].substr(0, req.body['"del'].length - 1);
    req.session.cart = req.session.cart.filter(n => n.id !== delIdInfo)
    req.session.save();
    res.send({ hello: 'delete' });
  }
  if (req.rawHeaders.indexOf('Item') != -1) {

    let reqId = req.body['"id'];
    reqId = reqId.substr(0, reqId.length - 1);

    if (req.session.cart == undefined) {
      req.session.cart = [];
    }

    const foundItemIndex = req.session.cart.findIndex(i => i.id === reqId);

    if (foundItemIndex > -1) {
      req.session.cart[foundItemIndex].quantity += 1;
    } else {
      const reqIdObj = new Object;
      reqIdObj.id = reqId;
      reqIdObj.quantity = 1;
      req.session.cart.push(reqIdObj);
    }
    req.session.save();
    res.header("Access-Control-Allow-Origin", "127.0.0.1:5000");
    res.json({
      success: true
    });
  }
});


// User Cart
router.get('/mycart', urlencodedParser, (req, res) => {
  if (req.session.cart != undefined && req.session.cart.length > 0) {
    const quantity = req.session.cart;
    newArr = []
    const sql = 'SELECT * FROM allGoods WHERE id IN(\'' + req.session.cart.map(i => i.id).join("','") + '\')';
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
      res.render('mycart', {
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

module.exports = router;
