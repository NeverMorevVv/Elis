const express = require('express');
const router = express.Router();
const {
  ensureAuthenticated,
  forwardAuthenticated,
  adminAuthenticated
} = require('../config/auth');
const mysql = require('mysql');
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({
  extended: false
});

// база данных
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dataBase',
});
pool.getConnection(function(err, connection) {
  connection.query('SELECT * FROM allGoods', function(error, results) {
    connection.release();
    if (error) throw error;
  });
});


// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('index', {
  user: req.user
}));

// desk
router.get('/desk', forwardAuthenticated, (req, res) => {
  const sql = 'SELECT * FROM allGoods';
  pool.query(sql, (err, data) => {
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
    pool.query(sql, (err, data) => {
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
router.get('/admin', ensureAuthenticated, adminAuthenticated, (req, res) => {

  const sql = 'SELECT * FROM allGoods';
  pool.query(sql, (err, data) => {
    if (err) throw err;
    var currentData = (item => {
      return data;
    });
    if (req.query.id != undefined) {
      const sql = 'DELETE FROM allGoods WHERE id = ' + req.query.id;
      pool.query(sql, (err, data) => {
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
  pool.query(sql, newGood, (err, result) => {
    if (err) throw err;
    currentMessage = '1 record inserted';
    res.redirect("back");
    // });
  });
});

//User page
router.get('/mypage', ensureAuthenticated, (req, res) =>
  res.render('mypage', {
    user: req.user
  })
);

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('', {
    user: req.user
  })
);

// User Cart
router.get('/mycart', urlencodedParser, (req, res) => {
  res.render('mycart', {
    user: req.user
  })
});


// Cart page
// router.get("/mycart", urlencodedParser, (req, res) => {
//   console.log(req);
//
//   if (req.query.data_id != undefined && req.query.data_count == null && !req.query.data_flag) {
//     console.log(req.query.data_id);
//     data_id = req.query.data_id;
//
//     function change(data) {
//       const sql = 'DELETE FROM selected WHERE id = ' + data;
//       pool.query(sql, (err, result) => {
//         if (err) throw err;
//         console.log('1 record delete');
//       });
//     }
//     change(data_id);
//   }
//   if (req.query.data_id != undefined && req.query.data_count != null) {
//     if (req.query.data_count == 'plus') {
//       const sql = 'UPDATE selected SET quantity = quantity+1 WHERE id = ' + req.query.data_id;
//       pool.query(sql, (err, result) => {
//         if (err) throw err;
//         console.log('1 record update');
//       });
//     }
//     if (req.query.data_count == 'minus') {
//       const sql = 'UPDATE selected SET quantity = quantity-1 WHERE quantity>1 AND id = ' + req.query.data_id;
//       pool.query(sql, (err, result) => {
//         if (err) throw err;
//         console.log('1 record update');
//       });
//     }
//   }
//   if (req.query.data_flag) {
//     console.log(req.query.data_id);
//     const sql = 'REPLACE INTO selected SET ?';
//     let loc = +(req.query.data_id)
//     let ins = {
//       id: loc
//     }
//     pool.query(sql, ins, (err, result) => {
//       if (err) throw err;
//       console.log('1 record inserted');
//     });
//
//   }
//   const sql = 'SELECT * FROM allGoods LEFT JOIN selected ON (allGoods.id=selected.id) WHERE allGoods.id=selected.id';
//   pool.query(sql, (err, data) => {
//     if (err) throw err;
//     res.render("mycart", {
//       baseArr: data,
//     });
//   });
// });
//
router.post("/mycart", urlencodedParser, (req, res) => {
  let reqId = req.body['"id'];
  reqId = reqId.substr(0,reqId.length - 1);
  console.log(req.session);

  if (req.session.cart == undefined) {
    var sessionCart = [];
    reqIdObj = new Object;
    reqIdObj.id = reqId;
    reqIdObj.quantity = 1;
    sessionCart.push(reqIdObj)
  } else {
  //   console.log("go next");
  //   if (sessionCart.indexOf(reqId) == -1) {
  //     // reqId = new Object;
  //     // reqId.id = reqId;
  //     // reqId.quantity = 1;
  //     // sessionCart.push(reqId)
  //   } else {
  //   //   // qq = sessionCart[sessionCart.indexOf(reqId)]
  //   //   // console.log(qq);
  }
  req.session.cart = sessionCart;

  console.log(req.session);
  res.header("Access-Control-Allow-Origin", "127.0.0.1:5000");


  // promises = [];
  // var tempArr =[];
  // let selectGoodsId = req.body;
  //
  // for (var i = 0; i < selectGoodsId.length; i++) {
  //   let loc = selectGoodsId[i].substr(4);
  //   loc = loc.substr(0, loc.length - 1);
  //
  //   promises.push(new Promise((resolve, reject) => {
  //     const sql = 'SELECT * FROM allGoods WHERE id =' + loc;
  //     pool.query(sql, (err, data) => {
  //       if (err) throw err;
  //       resolve(data);
  //     })
  //   }))
  // };
  //
  // Promise.all(promises).then(data => {
  //   tempArr = data[0];
  //   console.log(tempArr );
  //   res.render("mycart", {
  //     user: req.user,
  //     tempArr: tempArr
  //   })
  // });
});

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
