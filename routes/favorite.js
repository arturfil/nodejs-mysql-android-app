const secret = 'asd-80fads8-0afsd-80afsd-8';

const express = require('express');
const router = express.Router();
const moment = require('moment');

//==============================================
// FAVORITE TABLE
// GET / POST / DELETE
//==============================================
router.get('/', (req, res) => {
  if (req.query.key == secret) {
    const fbid = req.query.fbid
    if (fbid != null) {
      req.getConnection((error, conn) => {
        conn.query(`
          SELECT fbid, foodId, restaurantId, restaurantName, foodName, foodImage, price 
          FROM Favorite 
          WHERE fbid=?
        `,
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

router.get('/favoriteByRestaurant', (req, res) => {
  if (req.query.key == secret) {
    const fbid = req.query.fbid;
    const restaurant_id = req.query.restaurantId;
    if (fbid != null) {
      req.getConnection((error, conn) => {
        conn.query(`
          SELECT fbid, foodId, restaurantId, restaurantName, foodName, foodImage, price 
          FROM Favorite 
          WHERE fbid=?
          AND restaurantId=?
          `,
          [fbid, restaurant_id], (err, rows, fields) => {
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
    const food_id = req.body.foodId;
    const restaurant_id = req.body.restaurantId;
    const restaurant_name = req.body.restaurantName;
    const food_name = req.body.foodName
    const food_image = req.body.price
    const food_price = req.body.price

    if (fbid != null) {
      req.getConnection((error, conn) => {
        conn.query(`
          INSERT INTO Favorite(FBID, FoodId, RestaurantId, RestaurantName, FoodName, FoodImage, Price) 
          VALUES(?,?,?,?,?,?,?)`,
          [fbid, food_id, restaurant_id, restaurant_name, food_name, food_image, food_price],
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

router.delete('/', (req, res) => {
  if (req.query.key == secret) {
    const fbid = req.query.fbid;
    const food_id = req.query.foodId;
    const restaurant_id = req.query.restaurantId;
    if (fbid != null) {
      req.getConnection((error, conn) => {
        conn.query('DELETE FROM Favorite WHERE FBID=? AND FoodId=? AND RestauranId=?',
          [fbid, food_id, restaurant_id], (err, rows, fields) => {
            if (err) {
              res.status(500);
              res.send(JSON.stringify({ success: false, message: err.message }))
            } else {
              if (rows.affectedRows > 0) {
                res.send(JSON.stringify({ success: true, message: "Success " }));
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

module.exports = router;