// NOT WORKING FOR NOW

exports.getuser = (req, res, next) => {
  if (req.query.key == secret) {
    const fbid = req.query.fbid
    if (fbid != null) {
      req.getConnection((error, conn) => {
        conn.query('SELECT userPhone, name, address, fbid FROM User WHERE fbid=?', [fbid], (err, rows, fields) => {
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
}

exports.signup = (req, res, next) => {
  if (req.body.key == secret) {
    const fbid = req.body.fbid;
    const user_phone = req.body.userPhone;
    const user_name = req.body.userName;
    const user_address = req.body.userAddress;
    if (fbid != null) {
      req.getConnection((error, conn) => {
        conn.query('INSERT INTO User(FBID, UserPhone, Name, Address) VALUES(?,?,?,?) ON DUPLICATE KEY UPDATE Name=?, Address=?',
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
}