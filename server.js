// ---------------------- Server Requirements
require('dotenv').config();
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const { ensureAuthenticated, forwardAuthenticated } = require('./config/auth');


const app = express();

const PORT = process.env.PORT || 5000;

// ---------------------- DB Config
var db = require('./config/keys').mongoURI;

// ---------------------- Connect to Mongo
const connectionString = 'mongodb://localhost:27017/flixr-io';

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
 });

 mongoose.connection.on("connected", () => {
  console.log("connected", connectionString)
});

mongoose.connection.on("error", (err) => {
  console.log("error", err)
});

mongoose.connection.on("disconnected", () => {
  console.log("disconnected")
});

// ---------------------- Passport Config
require('./config/passport')(passport);

// ---------------------- EJS Setup
app.set('view engine', 'ejs');

// ---------------------- Express Session Setup
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
)

// ---------------------- Express Middleware 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));


app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));

// ---------------------- Passport Middleware 
app.use(passport.initialize());
app.use(passport.session());

// ---------------------- Connect to Flash
app.use(flash());

// ---------------------- Global Variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


// ---------------------- Routes 
app.use('/', require('./controllers/index'));
app.use('/users', require('./controllers/usersController'));
app.use('/movies', require('./controllers/moviesController'));
app.use('/playlists', ensureAuthenticated, require('./controllers/playlistsController'));

app.get('/', (req, res) => {
  res.render('index');
});


app.get('*', (req, res) => {
  res.render('404');
});

// ---------------------- Listener
app.listen(PORT, () => {
  console.log('Server running on PORT: ', PORT);
});