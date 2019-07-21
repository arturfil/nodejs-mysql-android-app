const secret = 'asd-80fads8-0afsd-80afsd-8';

const express = require('express');
const router = express.Router();

//==============================================
// RESTAURANT TABLE
// GET / POST / DELETE
//==============================================
router.get('/menuById', (req, res, next) => {
  if (req.query.key == secret) {
    req.getConnection((error, conn) => {
      const restaurant_id = req.query.restaurantId;
      if (restaurant_id != null) {
        conn.query(`
            SELECT id,name,description,image
            FROM Menu 
            WHERE id in 
            (SELECT menuId FROM Restaurant_Menu WHERE restaurantId=?)
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