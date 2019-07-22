const secret = 'asd-80fads8-0afsd-80afsd-8';
const moment = require('moment');
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

router.post('/createOrder', (req, res, next) => {
  if (req.body.key == secret) {
    const order_phone = req.body.orderPhone;
    const order_name = req.body.orderName;
    const order_address = req.body.orderAddress;
    const order_date = moment(req.body.orderDate, "MM/DD/YYYY").format("YYYY-MM-DD");
    const restaurant_id = req.body.restaurantId;
    const transaction_id = req.body.transactionId;
    const cod = req.body.cod;
    const total_price = req.body.totalPrice;
    const num_of_item = req.body.numOfItem;
    const order_fbid = req.body.orderFBID;

    if (order_fbid != null) {
      req.getConnection((error, conn) => {
        conn.query(
          'INSERT INTO `Order`(OrderFBID,OrderPhone,OrderName,OrderAddress,OrderStatus,OrderDate,RestaurantId,' 
          + 'TransactionId,COD,TotalPrice,NumOfItem) VALUES(?,?,?,?,?,?,?,?,?,?,?)',
          [order_fbid,order_phone,order_name,order_address,0,order_date,restaurant_id,transaction_id,cod,total_price,num_of_item],
          (err, rows, fields) => {
            if (err) {
              res.status(500);
              res.send(JSON.stringify({ success: false, message: err.message }))
            } else {
              conn.query(
                'SELECT OrderId as orderNumber'
                + ' FROM `Order` WHERE OrderFBID=? AND NumOfItem > 0 '
                + ' ORDER BY orderNumber DESC LIMIT 1',
                [order_fbid],
                (err, rows, fields) => {
                  if (err) {
                    res.status(500);
                    res.send(JSON.stringify({ success: false, message: err.message }))
                  } else {
                    res.send(JSON.stringify({success: true, result:rows}))
                  }
              })
            }
          })
      })
    } else {
      res.send(JSON.stringify({ success: false, message: "Missing orderFBID in body" }))
    }
  } else {
    res.send(JSON.stringify({ success: false, message: "Wrong secret Key" }))
  }
})

router.get('/orderDetail', (req, res, next) => {
  if (req.query.key == secret) {
    req.getConnection((error, conn) => {
      const order_id = req.query.orderId;
      if (order_id != null) {
        conn.query(`
          SELECT orderId,itemId,quantity,discount,extraPrice,size,addOn
          FROM OrderDetail
          WHERE orderId=?
          `,
          [order_id],
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

router.post('/updateOrder', (req, res, next) => {
  if (req.body.key == secret) {
    let order_id = req.body.orderId;
    let order_detail = req.body.orderDetail;
    
    try {
      order_detail = JSON.parse(req.body.orderDetail)
    } catch(err) {
      res.status(500);
      res.send(JSON.stringify({ success: false, message: err.message }))
    }

    if(order_detail != null && order_id != null) {
      const data_insert = []
      for(i = 0; i < order_detail.length; i++) {
        data_insert[i] = [
          parseInt(order_id),
          order_detail[i]["foodId"],
          order_detail[i]["foodQuantity"],
          order_detail[i]["foodPrice"],
          0,
          order_detail[i]["foodSize"],
          order_detail[i]["foodAddon"],
          parseFloat(order_detail[i]["foodExtraPrice"])
        ]
      }

      req.getConnection((error, conn) => {
        conn.query(
          'INSERT INTO OrderDetail(OrderId,ItemId,Quantity,Price,Discount,Size,Addon,ExtraPrice) VALUES(?)',
        data_insert,
        (err, rows, fields) => {
          if (err) {
            res.status(500);
            res.send(JSON.stringify({ success: false, message: err.message }))
          } else {
            res.send(JSON.stringify({ success: true, message: "Update Successful" }))
          }
        })
      })
    } else {
      res.send(JSON.stringify({ success: false, message: "Missing orderId and orderDetail in body" }))
    }
  } else {
    res.send(JSON.stringify({ success: false, message: "Wrong secret Key" }))
  }
})

module.exports = router;