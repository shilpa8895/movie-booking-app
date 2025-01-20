const mongoose = require('mongoose');

// Showtime Schema will be embedded inside Cinema Schema
const cinemaSchema = new mongoose.Schema({
  cinema_name: {
    type: String,
    required: true
  },
  showtimes: [{
    movie_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie', // Reference to the Movie model
      required: true
    },
    showtime: {
      type: String, // Example: "7:00 PM"
      required: true
    },
    date: {
      type: Date, // Date of the showtime
      required: true
    }
  }]
});

const Cinema = mongoose.model('Cinema', cinemaSchema);

module.exports = Cinema;
