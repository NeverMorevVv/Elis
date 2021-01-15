const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

const app = express();

// Passport Config
require('./config/passport')(passport);

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// fileUploader
app.use(fileUpload({
  limits: {
    fileSize: 50 * 1024 * 1024
  },
}));

// Express body parser
app.use(bodyParser.json());
app.use(express.urlencoded({
  extended: true
}));
// Cookie Parser
app.use(cookieParser());

// Express session
app.use(
    session({
        resave: true,
        secret: 'fawefawfAWdsqdqwd',
        saveUninitialized: true,
        cookie: {maxAge: 60000000}
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./routes/index.js'));
app.use('/', require('./routes/cart.js'));
app.use('/', require('./routes/login.js'));
app.use('/', express.static(__dirname + '/public'));




const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
