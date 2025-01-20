const express = require('express');
const Cinema = require('../model/cinemaSchema'); // Import Cinema model
const Movie = require('../model/movieSchema'); // Import Movie model
const router = express.Router();

// Add a new Cinema
router.post('/', async (req, res) => {
  const { cinema_name, showtimes } = req.body;

  try {
    const newCinema = new Cinema({
      cinema_name,
      showtimes
    });

    await newCinema.save();
    res.status(200).json(newCinema);
  } catch (err) {
    res.status(500).json({ message: 'Error creating cinema', error: err });
  }
});

// Add multiple Cinemas
router.post('/bulk', async (req, res) => {
    const cinemas = req.body.cinemas;
  
    try {
      // Create an array to hold the created cinemas
      const createdCinemas = [];
  
      // Iterate through the cinemas array and create each cinema
      for (let cinemaData of cinemas) {
        const { cinema_name, showtimes } = cinemaData;
  
        const newCinema = new Cinema({
          cinema_name,
          showtimes
        });
  
        // Save the cinema to the database
        const savedCinema = await newCinema.save();
        createdCinemas.push(savedCinema);
      }
  
      // Respond with all the created cinemas
      res.status(200).json(createdCinemas);
    } catch (err) {
      res.status(500).json({ message: 'Error creating cinemas', error: err });
    }
  });

// route to fetch the cinema and showtime by movie id
router.get('/movie/:movieId', async (req, res) => {
    const { movieId } = req.params;
    console.log('Received Movie ID:', movieId);

    try {
        // Find cinemas where the movie ID is in the showtimes array
        const cinemas = await Cinema.find({
            'showtimes.movie_id': movieId,
        });

        console.log('Cinemas before filtering showtimes:', cinemas);

        if (!cinemas || cinemas.length === 0) {
            // Return a message instead of an error code
            return res.status(200).json({ message: 'No cinemas found for this movie' });
        }

        // Filter each cinema's showtimes to include only those matching the movieId
        const filteredCinemas = cinemas.map((cinema) => {
            const relevantShowtimes = cinema.showtimes.filter(
                (showtime) => showtime.movie_id.toString() === movieId
            );
            return {
                ...cinema._doc, // Spread the original cinema document
                showtimes: relevantShowtimes, // Replace showtimes with filtered ones
            };
        });

        // Remove cinemas that no longer have any showtimes for this movie
        const finalCinemas = filteredCinemas.filter((cinema) => cinema.showtimes.length > 0);

        console.log('Filtered and Final Cinemas:', finalCinemas);

        if (finalCinemas.length === 0) {
            // Return a message instead of an error code
            return res.status(200).json({ message: 'No cinemas found for this movie' });
        }

        // Send the final cinemas data
        res.status(200).json(finalCinemas);
    } catch (error) {
        console.error('Error fetching cinemas:', error);
        res.status(500).json({ message: 'Error fetching cinemas', error: error.message });
    }
});



module.exports = router;
