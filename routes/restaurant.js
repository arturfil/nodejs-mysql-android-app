const secret = 'asd-80fads8-0afsd-80afsd-8';

const express = require('express');
const router = express.Router();
const moment = require('moment');

//==============================================
// RESTAURANT TABLE
// GET / POST / DELETE
//==============================================
router.get('/', (req, res, next) => {
  if (req.query.key == secret) {
      req.getConnection((error, conn) => {
        conn.query(`
          SELECT id,name,address,phone,lat,lng,userOwner,image,paymentUrl 
          FROM Restaurant 
          `,
          (err, rows, fields) => {
            if (err) {
              res.status(500);
              res.send(JSON.stringify({ success: false, message: err.message }))
            } else {
              if (rows.length > 0) {
                res.send(JSON.stringify({ success: true, result: rows }));
              } else {
                res.send(JSON.stringify({ success: false, message: "Empty" }))
              }
            }
          })
      })
  } else {
    res.send(JSON.stringify({ success: false, message: "Wrong secret Key" }))
  }
})

router.get('/restaurantById', (req, res, next) => {
  if (req.query.key == secret) {
    req.getConnection((error, conn) => {
      const restaurant_id = req.query.restaurantId;
      if(restaurant_id != null) {
        conn.query(`
            SELECT id,name,address,phone,lat,lng,userOwner,image,paymentUrl 
            FROM Restaurant 
            WHERE id=?
            `,
            [restaurant_id],
          (err, rows, fields) => {
            if (err) {
              res.status(500);
              res.send(JSON.stringify({ success: false, message: err.message }))
            } else {
              if (rows.length > 0) {
                res.send(JSON.stringify({ success: true, result: rows }));
              } else {
                res.send(JSON.stringify({ success: false, message: "Empty" }))
              }
            }
          })
        } else {
          res.send(JSON.stringify({ success: false, message: "Missing restaurantId in query" }))
        }
    })
  } else {
    res.send(JSON.stringify({ success: false, message: "Wrong secret Key" }))
  }
})

module.exports = router;


