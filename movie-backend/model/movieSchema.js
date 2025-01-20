const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  movie_name: {
    type: String,
    required: true
  },
  release_date: {
    type: Date,
    required: true,
    set: function(value) {
      // Ensure the stored date has no time, set time to midnight
      const date = new Date(value);
      date.setHours(0, 0, 0, 0);  // Set time to 00:00:00
      return date;
    }
  },
  genre: {
    type: String,
    required: true
  },
  cast_and_crew: [
    {
      Director: {
        type: String,
        required: true
      },
      Actor: {
        type: String,
        required: true
      }
    }
  ],
  synopsis: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  trailer_link: {
    type: String,
    required: true
  }
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
