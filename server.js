// Load the modules
var express = require('express'); //Express - a web application framework that provides useful utility functions like 'http'
var app = express();
var bodyParser = require('body-parser'); // Body-parser -- a library that provides functions for parsing incoming requests
app.use(bodyParser.json());              // Support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Support encoded bodies
const axios = require('axios');
const qs = require('query-string');

const dbConfig = {
  host: 'db',
  port: 5432,
  database: 'reviews_db',
  user: 'postgres',
  password: 'pwd'
};

var db = pgp(dbConfig);

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));// Set the relative path; makes accessing the resource directory easier


// Home page - DON'T CHANGE
app.get('/', function(req, res) {
  res.render('pages/main', {
    my_title: "Main page",
    items: '',
    error: false,
    message: ''
  });
});
app.get('/main', function(req, res) {
  res.render('pages/main', {
    my_title: "Main page",
    items: '',
    error: false,
    message: ''
  });
});

//to request data from API for given search criteria
//TODO: You need to edit the code for this route to search for movie reviews and return them to the front-end
app.post('/get_feed', function(req, res) {

});


app.listen(3000);
console.log('3000 is the magic port');
