const secret = 'asd-80fads8-0afsd-80afsd-8';

const express = require('express');
const router = express.Router();

//==============================================
// RESTAURANT TABLE
// GET / POST / DELETE
//==============================================
router.get('/', (req, res, next) => {
  if (req.query.key == secret) {
    req.getConnection((error, conn) => {
      const menu_id = req.query.menuId;
      if (menu_id != null) {
        conn.query(
            `SELECT id,name,description,image,price,
            CASE WHEN isSize=1 THEN \'TRUE\' ELSE \'FALSE\' END as isSize,`
          + `CASE WHEN isAddon=1 THEN \'TRUE\' ELSE \'FALSE\' END as isAddon,
            discount FROM Food
            WHERE id in 
            (SELECT foodId FROM Menu_Food WHERE menuId=?)
            `,
          [menu_id],
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
        res.send(JSON.stringify({ success: false, message: "Missing menuId in query" }))
      }
    })
  } else {
    res.send(JSON.stringify({ success: false, message: "Wrong secret Key" }))
  }
})

router.get('/foodById', (req, res, next) => {
  if (req.query.key == secret) {
    req.getConnection((error, conn) => {
      const food_id = req.query.foodId;
      if (food_id != null) {
        conn.query(
          `SELECT id,name,description,image,price,
            CASE WHEN isSize=1 THEN \'TRUE\' ELSE \'FALSE\' END as isSize,`
          + `CASE WHEN isAddon=1 THEN \'TRUE\' ELSE \'FALSE\' END as isAddon,
            discount FROM Food
            WHERE id =?
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