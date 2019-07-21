const express = require('express');
const app = express();
const mysql = require('mysql')
const myConnection = require('express-myconnection');
const bodyParser = require('body-parser');

const config = require('./db.js');
const dbOptions = {
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  port: config.database.port,
  database: config.database.db
}

// const routes = require('./routes/main');
const publicDir = (__dirname + '/public/'); // set static dir for image display

app.use(express.static(publicDir));
app.use(myConnection(mysql, dbOptions, 'pool'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());

// app.use('/', routes);
app.use('/api/user', require('./routes/user'));
app.use('/api/favorite', require('./routes/favorite'));
app.use('/api/restaurant', require('./routes/restaurant'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/food', require('./routes/food'));
app.use('/api/size', require('./routes/size'));
app.use('/api/addon', require('./routes/addon'));
app.use('/api/order', require('./routes/order'));

const port = 5000 || process.env.PORT;

app.listen(port, () => {
  console.log('restaurant w/ mysql server has started in port ' + port)
})