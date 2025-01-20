const mongoose = require('mongoose');

const userBookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movieName: { type: String, required: true },
  cinemaName: { type: String, required: true },
  showtime: { type: String, required: true },
  showdate: { type: Date, required: true },
});

const UserBooking = mongoose.model('UserBooking', userBookingSchema);

module.exports = UserBooking;
