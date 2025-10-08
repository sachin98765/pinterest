// app.js
require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressSession = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const User = require('./models/user'); // ✅ Make sure you have a User model

const app = express();

// 🟢 Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// 🟢 View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 🟢 Middleware
app.use(flash());
app.use(expressSession({
  resave: false,
  saveUninitialized: true,
  secret: 'key secret key'
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy()); // ✅ Initialize Passport with model
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// 🟢 Serve static files
app.use("/images/uploads", express.static("uploads"));
app.use(express.static(path.join(__dirname, 'public')));

// 🟢 Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// 🟢 404 Handler
app.use(function(req, res, next) {
  next(createError(404));
});

// 🟢 Error Handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
