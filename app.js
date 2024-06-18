var createError = require('http-errors');
var express = require('express');
const cors = require("cors");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const connectDB = require('./src/config/db');


const indexRouter = require('./src/routes/index');
const usersRouter = require('./src/routes/users');
const ordersRouter = require('./src/routes/orders');
const authRouter = require('./src/routes/auth');


const authMiddleware = require("./src/middlewares/authMiddleware");
const errorHandlerMiddleware = require("./src/middlewares/errorHandlerMiddleware");
const notFoundErrorHandlerMiddleware = require("./src/middlewares/notFoundErrorHandlerMiddleware");



var app = express();
connectDB();


// view engine setup
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set custom middlewares.
app.use(authMiddleware.authenticate);


// Set routes.
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/orders', ordersRouter);
app.use('/auth', authRouter);


// Set default error handler middlewares.
app.use(notFoundErrorHandlerMiddleware);
app.use(errorHandlerMiddleware);


module.exports = app;
