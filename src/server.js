// Load the modules
var express = require('express'); //Express - a web application framework that provides useful utility functions like 'http'
var app = express();
var bodyParser = require('body-parser'); // Body-parser -- a library that provides functions for parsing incoming requests
app.use(bodyParser.json());              // Support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Support encoded bodies
const axios = require('axios');
const qs = require('query-string');
var pgp = require('pg-promise')();
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
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/'));// Set the relative path; makes accessing the resource directory easier

global.globalString = '';
// Home page - DON'T CHANGE
app.get('/', function(req, res) {
  res.render('pages/main', {
    my_title: "Home",
    item: '',
    error: false,
    message: ''
  });
});

app.get('/reviews', function(req,res){
  //query
  var rs = "select * from reviews;";
  //querying
  //console.log(rs)
  db.task('get-everything', task => {
        return task.batch([
            task.any(rs)
        ]);
    })
  //returning the data back to the reviews page
    .then(function (data) {
      //console.log(data[0]);
      res.status(200).render('pages/reviews',{
        my_title: "Reviews",
        reviews: data[0],
        error: false,
        message: ''
      });
    })
    .catch(function (err) {
      console.log('error', err);
      res.render('pages/reviews', { // Status code here
        my_title: "Reviews",
        reviews: '',
        error: false,
        message: ''
      });
  });
});

app.get('/reviews/filter', function(req,res){
  //query
  var title = req.query.filterWord;
  console.log(title);
  var rs = "select * from reviews where movie_title = '"+title+"';";
  var rws = "select * from reviews;";
  var index = 0;
  //querying
  console.log(rs)
  db.task('get-everything', task => {
        return task.batch([
            task.any(rs),
            task.any(rws)
        ]);
    })
  //returning the data back to the reviews page
    .then(function (data) {
      console.log(data[0]);
      if(data[0].length == 0){
        index = 1;
      }
      res.status(200).render('pages/reviews',{
        my_title: "Reviews",
        reviews: data[index],
        error: false,
        message: ''
      });
    })
    .catch(function (err) {
      console.log('error', err);
      res.render('pages/reviews', { // Status code here
        my_title: "Reviews",
        reviews: '',
        error: false,
        message: ''
      });
  });
});

//to request data from API for given search criteria
//TODO: You need to edit the code for this route to search for movie reviews and return them to the front-end
app.post('/main', function(req, res) {
  var title = req.body.mTitle; //TODO: Remove null and fetch the param (e.g, req.body.param_name); Check the NYTimes_home.ejs file or console.log("request parameters: ", req) to determine the parameter names
  var api_key = '755f51f7'; // TOOD: Remove null and replace with your API key you received at the setup

  if(title) {
    axios({
      url: `http://www.omdbapi.com/?t=${title}&apikey=${api_key}`,
        method: 'GET',
        dataType:'json',
      })
        .then(items => {
          // TODO: Return the reviews to the front-end (e.g., res.render(...);); Try printing 'items' to the console to see what the GET request to the Twitter API returned.
          // Did console.log(items) return anything useful? How about console.log(items.data.results)?
          // Stuck? Look at the '/' route above
            //console.log(items);
           console.log(items.data);
           globalString = items.data.Title;
           console.log(globalString);
          res.render('pages/main',{
              my_title: "Home",
              item: items.data,
              error: false,
              message: ''
              })
          })
        .catch(error => {
          console.log(error);
          res.render('pages/main',{
            my_title: "Home",
            item: '',
            error: true,
            message: error
          })
        });


  }
  else {
    // TODO: Render the home page and include an error message (e.g., res.render(...);); Why was there an error? When does this code get executed? Look at the if statement above
    // Stuck? On the web page, try submitting a search query without a search term
    res.render('pages/main',{
      my_title: "Home",
      item: '',
      error: true,
      message: 'No movies to search'
    })
  }
});

app.post('/main/addReview', function(req, res) {
    //update the table
  var title = globalString;
  console.log(title);
  var review_name = req.body.reviewName;
  var review = req.body.review;
  let date = new Date();
  //console.log(date);
  var day = date.getDate();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var date2 = ""+year+"-"+month+"-"+day+"";
  // console.log(date2);
  var update = "insert into reviews (movie_title,movie_review_name,movie_review,review_date) values ('"+title+"','"+review_name+"','"+review+"','"+date2+"');";
  console.log(update);
  //insert the review
  db.one(update)
  //returning to the reviews page
  res.redirect('/reviews');
});

app.listen(3000);
console.log('3000 is the magic port');
