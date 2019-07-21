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

router.get('/nearbyRestaurant', (req, res, next) => {
  if (req.query.key == secret) {
    req.getConnection((error, conn) => {
      const user_lat = parseFloat(req.query.lat);
      const user_lng = parseFloat(req.query.lng);
      const distance = parseFloat(req.query.distance);
      if (user_lat !== Number.NaN && user_lng !== Number.NaN) {  
        conn.query(`
          SELECT * FROM (SELECT id, name, address, phone, lat,lng,userOwner,image,paymentUrl,` 
          +` ROUND(111.045 * DEGREES(ACOS(COS(RADIANS(?)) * COS(RADIANS(lat))`
          +` * COS(RADIANS(lng) - RADIANS(?)) + SIN(RADIANS(?)) `
          +` * SIN(RADIANS(lat)))),2)
            AS distance_in_km 
            FROM Restaurant)tempTable
            WHERE distance_in_km < ?
          `,
          [user_lat, user_lng,user_lat,distance],
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
        res.send(JSON.stringify({ success: false, message: "MIssing lat and lng in query"}))
      }
    })
  } else {
    res.send(JSON.stringify({ success: false, message: "Wrong secret Key" }))
  }
})

module.exports = router;


