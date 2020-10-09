// ---------------------- Server Requirements
require('dotenv').config();
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

const app = express();

const PORT = process.env.PORT || 5000;

const routes = require('./routes');
var db = require ('./models');

// Configuration
require('./config/passport')(passport);

// Middleware 
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static('public'));
