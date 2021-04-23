DROP TABLE IF EXISTS conditions CASCADE;
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  movie_title VARCHAR(50),
  movie_review_name VARCHAR(100),
  movie_review VARCHAR(500),
  review_date DATE
);

INSERT INTO reviews (movie_title,movie_review_name,movie_review,review_date) VALUES ('Fight Club','Fight Club Review','Good Movie','2021-04-22');