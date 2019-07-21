const secret = 'asd-80fads8-0afsd-80afsd-8';

const express = require('express');
const router = express.Router();

//==============================================
// ORDER TABLE
// GET / POST / DELETE
//==============================================
router.get('/', (req, res, next) => {
  if (req.query.key == secret) {
    req.getConnection((error, conn) => {
      const order_fbid = req.query.orderFBID;
      if (order_fbid != null) {
        conn.query(
          'SELECT orderId,orderFBID,orderPhone,orderName,orderAddress,orderStatus,orderDate,'
          + 'restaurantId,transactionId,'
          + 'CASE WHEN cod=1 THEN \'TURE\' ELSE \'FALSE\' END as cod,'
          + 'totalPrice,numOfItem FROM `Order` '
          + 'WHERE orderFBID =? AND numOfItem > 0'
          + ' ORDER BY orderId DESC'
            ,
          [order_fbid],
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
        res.send(JSON.stringify({ success: false, message: "Missing orderFBID in query" }))
      }
    })
  } else {
    res.send(JSON.stringify({ success: false, message: "Wrong secret Key" }))
  }
})

module.exports = router;