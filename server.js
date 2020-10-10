// ---------------------- Server Requirements
require('dotenv').config();
const express = require('express');
// const passport = require('passport');
// const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();

const PORT = process.env.PORT || 5000;

// const routes = require('./routes');
var db = require ('./models');



// ---------------------- Configuration
// require('./config/passport')(passport);

app.set('view engine', 'ejs');


// ---------------------- Middleware 
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(__dirname + '/public'));
// app.use(express.static('public'));
// app.use(session({
//     key: 'user_sid',
//     secret: process.env.SESSION_SECRET,
//     resave: true,
//     saveUninitialized: false,
//     cookie: {
//         // Will expire after 3hrs
//         expires: 10800000, 
//         httpOnly: false
//     }
// }))
// app.use(passport.initialize());

app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));


// ---------------------- For persistent login sessions
// app.use(passport.session()); 
// app.use(routes);


// ---------------------- Routes 

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