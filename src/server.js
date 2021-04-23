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
  res.render('pages/reviews',{
    my_title: "Reviews",
    reviews: '',
    error: false,
    message: ''
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
  var title = req;
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
  db.task('get-everything', task => {
        return task.batch([
            task.any(update)
        ]);
    })
  //returning the data back to the main page
    .then(function (data) {
      res.status(200).render('pages/reviews',{
        my_title: "Reviews",
        reviews: '',
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

app.listen(3000);
console.log('3000 is the magic port');
