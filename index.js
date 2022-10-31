const express = require('express'),
  morgan = require('morgan'),
      fs = require('fs'), // import built in node modules fs and path
      path = require('path');

const app = express();
// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

// app.get('/movies', (res, req) =>{
//   res.status(200).json(movies);
// })
//
// app.get('/movies/:title', (req, res) => {
// const {title} = req.params;
// const movie = movies.find( movie => movies.Title === title );
// })
//
//   if (movie) {
//     res.status(200).json(movie);
//   } else {
//     res.status(400).send('no such movie')}

let topTenMovies = [
  {
    Title: 'City Lights',
    Director: 'Charlie Chaplin'
  },
  {
    Title: 'Singing in the Rain',
    Director: 'Gene Kelly' & 'Stanley Donen'
  },
  {
    Title: 'Notorious',
    Director: 'Alfred Hitchcock'
  },
  {
    Title: 'Vertigo',
    Director: 'Alfred Hitchcock'
  },
  {
    Title: 'Three colors: Red',
    Director: 'Krzysztof Kieślowski'
  },
  {
    Title: 'Boyhood',
    Director: 'Richard Linklater'
  },
  {
    Title: 'Casablanca',
    Director: 'Michael Curtiz'
  },
  {
    Title: 'Rear Window',
    Director: 'Alfred Hitchcock'
  },
  {
    Title: 'Citizen Kane',
    Director: 'Orson Welles'
  },
  {
    Title: 'The Godfather',
    Director: 'Francis Ford Coppola'
  }
];

//Get methods
app.get('/movies', function(req, res){
      res.send('List of all of the movies')
});

app.get('/movies/Genre', function(req, res){
    res.send('description of movie genres')
});

app.get('/movies/Title', function(req, res){
    res.send('Get single movies by title')
});

app.get('/movies/directors/name', function(req, res){
  res.send('Get director by name')
});

app.get('/users', function(req, res){
  res.send('Retrieve all users')
});

app.get('/users/name', function(req, res){
  res.send('Retrieve all users by username')
});

//Post methods
app.post('/users/Login', function(req, res){
  res.send('let existing users log in')
});

app.post('/users/Register', function(req, res){
  res.send('let new users register')
});

app.post('/users/Movies/MovieID', function(req, res){
  res.send('let users add favorited movies')
});

//put method
app.put('/users/Info', function(req, res){
  res.send('let users update their info')
});

//delete method
app.delete('/movie/MovieID', function(req, res){
  res.send('delete movie from favorited lsit')
});

app.delete('/users/UserID', function(req, res){
  res.send('delete existing user')
});

// setup the logger
app.use(morgan('common', {stream: accessLogStream}));
  app.use(express.static('public'));


// setup for Error
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke.');
  });

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
