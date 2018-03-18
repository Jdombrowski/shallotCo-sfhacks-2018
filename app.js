var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var simple_statistics = require('simple-statistics');
var models = require('./models');

var Sequelize = require('sequelize');
var sequelize = new Sequelize('shallot_development', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

var db = sequelize.define('Visitor', {}, {freezeTableName: true
    });

var test = sequelize.authenticate()
    .then(function() {
        console.log("Connected to database");
    })
    .catch(function(err) {
        console.log("app.js:19 Error: cannot connect to database")
    })
    .done();

var index = require('./routes/index');
var users = require('./routes/users');
var results = require('./routes/results');
var writeToDb = require('./routes/writeToDb');
var landing = require('./routes/landing');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/assets', express.static(path.join(__dirname,'/assets')));

app.use('/', landing);
app.use('/users', users);
app.use('/results', results);
app.use('/writeToDb', writeToDb);
app.use('/index', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
