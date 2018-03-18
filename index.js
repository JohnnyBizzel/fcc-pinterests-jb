// server.js
// where your node app starts
var express = require('express');
var mongoose = require('mongoose');
var cookieSession = require('cookie-session');
var passport = require('passport');
var bodyParser = require('body-parser');

require('./models/user');
require('./services/passport');

var dbUsr = process.env.MONGO_USR;
var dbPwd = process.env.MONGO_PASS;
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${encodeURIComponent(dbUsr)}:${encodeURIComponent(dbPwd)}@ds251988.mlab.com:51988/pinterests`);
console.log('Mongoose connection state=',mongoose.connection.readyState);
var app = express();

app.use(cookieSession({
  maxAge: 30 * 24 * 60 * 6000,
  keys: [process.env.COOKEE]
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
// next one needed to read form post request body
app.use(bodyParser.urlencoded({    
  extended: true
}));

app.set('view engine', 'ejs');

// http://expressjs.com/en/starter/static-files.html
// anything in the public folder gets served as at the site root.
app.use(express.static('public'));



// const authRoutes = require('./routes/authRoutes');
// authRoutes(app);
// === ABOVE resovles to this because require is a module.
require('./routes/authRoutes')(app);


require('./routes/pixRoutes')(app);


var listener = app.listen(process.env.PORT, function () {
  console.log('Pixterest is listening on port ' + listener.address().port);
});
