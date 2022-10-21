const express = require('express'),
  morgan = require('morgan'),
      fs = require('fs'), // import built in node modules fs and path
      path = require('path');

const app = express();
// create a write stream (in append mode)
// a ‘log.txt’ file is created in root directory
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'})

let topTenMoveis = [
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

// setup the logger
app.use(morgan('combined', {stream: accessLogStream}));

app.get('/', (req, res) => {
  res.send('Welcome to my app!');
});

app.get('/secreturl', (req, res) => {
  res.send('This is a secret url with super top-secret content.');
});

app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
  res.json(topTenMovies);
});

// setup for Error
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
