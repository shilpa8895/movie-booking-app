const express = require('express');
const Movie = require('../model/movieSchema');
const router = express.Router();

// Add a new movie
router.post('/', async (req, res) => {
  const { movie_name, release_date, genre, cast_and_crew, synopsis, image, trailer_link } = req.body;

  try {
    const newMovie = new Movie({ movie_name, release_date, genre, cast_and_crew, synopsis, image, trailer_link });
    await newMovie.save();
    res.status(200).send({ message: 'Movie added successfully!', movie: newMovie });
  } catch (error) {
    res.status(400).send({ error: 'Error adding movie details', details: error });
  }
});

// Add multiple movies
router.post('/bulk', async (req, res) => {
  const movies = req.body.movies;

  if (!Array.isArray(movies)) {
    return res.status(400).send({ error: 'Movies should be an array.' });
  }

  try {
    const newMovies = await Movie.insertMany(movies);
    res.status(200).send({ message: 'Movies added successfully!', movies: newMovies });
  } catch (error) {
    res.status(400).send({ error: 'Error adding movies', details: error });
  }
});

// Fetch all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching movie details', details: error });
  }
});

// Fetch movie by ID
router.get('/:id', async (req, res) => {
    try {
      const movie = await Movie.findById(req.params.id);
      if (!movie) {
        return res.status(404).send('Movie not found');
      }
      res.json(movie);
    } catch (error) {
      console.error('Error fetching movie by ID:', error);
      res.status(500).send('Server error');
    }
  });

module.exports = router;
