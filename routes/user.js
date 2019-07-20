const secret = 'asd-80fads8-0afsd-80afsd-8';

const express = require('express');
const router = express.Router();
const moment = require('moment');

//==============================================
// User Table
// GET / POST
//==============================================
router.get('/', (req, res, next) => {
  if (req.query.key == secret) {
    const fbid = req.query.fbid
    if (fbid != null) {
      req.getConnection((error, conn) => {
        conn.query('SELECT userPhone, name, address, fbid FROM User WHERE fbid=?',
          [fbid], (err, rows, fields) => {
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
      res.send(JSON.stringify({ success: false, message: "Missing fbid in query" }))
    }
  } else {
    res.send(JSON.stringify({ success: false, message: "Wrong secret Key" }))
  }
})

router.post('/', (req, res, next) => {
  if (req.body.key == secret) {
    const fbid = req.body.fbid;
    const user_phone = req.body.userPhone;
    const user_name = req.body.userName;
    const user_address = req.body.userAddress;
    if (fbid != null) {
      req.getConnection((error, conn) => {
        conn.query(`
          INSERT INTO User(FBID, UserPhone, Name, Address) 
          VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE Name=?, Address=?`,
          [fbid, user_phone, user_name, user_address, user_name, user_address],
          (err, rows, fields) => {
            if (err) {
              res.status(500);
              res.send(JSON.stringify({ success: false, message: err.message }))
            } else {
              if (rows.affectedRows > 0) {
                res.send(JSON.stringify({ success: true, message: "Success" }));
              }
            }
          })
      })
    } else {
      res.send(JSON.stringify({ success: false, message: "Missing fbid in body" }))
    }
  } else {
    res.send(JSON.stringify({ success: false, message: "Wrong secret Key" }))
  }
})

module.exports = router;