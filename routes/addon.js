const secret = 'asd-80fads8-0afsd-80afsd-8';

const express = require('express');
const router = express.Router();

//==============================================
// ADDON TABLE
// GET / POST / DELETE
//==============================================
router.get('/', (req, res, next) => {
  if (req.query.key == secret) {
    req.getConnection((error, conn) => {
      const food_id = req.query.foodId;
      if (food_id != null) {
        conn.query(
          `SELECT id,description,extraPrice
          FROM Addon WHERE id in(SELECT addonId FROM Food_Addon WHERE foodId=?)
            `,
          [food_id],
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
        res.send(JSON.stringify({ success: false, message: "Missing foodId in query" }))
      }
    })
  } else {
    res.send(JSON.stringify({ success: false, message: "Wrong secret Key" }))
  }
})

module.exports = router;