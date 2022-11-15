const express = require('express'),
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid'),
  fs = require('fs'),
  Models = require('./models.js'),
  path = require('path');

const app = express();
const mongoose = require('mongoose');


const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;


const url = "mongodb://127.0.0.1:27017";

mongoose.connect(url).then(() => {
    console.log("Connected to Database");
}).catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

//log requrests to server
app.use(morgan("common"));



const cors = require('cors');
app.use(cors());


//fs.createWriteStream is used to create a write stream while path.join appends it to log,txt file
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})
app.use(morgan('common', {stream: accessLogStream}));
app.use(express.static('public'));

//default text response
app.get('/', (req, res) => {
  res.send('Welcome to MyFlix!');
});


// Get all Movies
app.get('/movies', (req, res) => {
  Movies.find()
  .then((movies) => {
    res.status(200).json(movies);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

// get movies by title
app.get('/movies/:title', (req, res) => {
  Movies.findOne({ Title: req.params.title})
  .then((movie) => {
    res.status(200).json(movie);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

//get json genre info when looking for specific Genre
app.get("/movies/genres/:Name", (req, res) => {
  Movies.findOne({Name: req.params.Genre})
    .then((movies) => {
      res.json(movies.Genre); 
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//get info on ddirector when looking for specific Driector
app.get("/movies/directors/:Name", (req, res) => {
  Movies.findOne({Name: req.params.Director})
    .then((movies) => {
      res.json(movies.Director);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Get all users
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get a user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Name: req.params.Name })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//update user info
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Name: req.params.Name }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, 
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Add a movies to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Name }, {
     $push: { FavoriteMovie: req.params._id }
   },
   { new: true }, 
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//Add new users
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Delete a user by username
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Name })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Name + ' was not found');
      } else {
        res.status(200).send(req.params.Name + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//delete a user's favorited movie
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Name}, {
    $pull: { FavoriteMovies: req.params._id }
  },
  { new: true },
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//PORT
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('listening on Port ' + port);
});
