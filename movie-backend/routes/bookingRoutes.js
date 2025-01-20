// routes/bookingRoutes.js
const express = require('express');
const UserBooking = require('../model/userBookingSchema');
const Cinema = require('../model/cinemaSchema'); // Assuming you have a Cinema model
const router = express.Router();

// Create a new booking
router.post('/book', async (req, res) => {
  const { userId, movieName, cinemaName, showtime, showdate } = req.body;

  try {
    // Find the cinema that matches the cinema name and contains the desired showtime
    const cinema = await Cinema.findOne({ cinema_name: cinemaName });

    // Find the showtime that matches the requested showtime and date
    const showtimeDetails = cinema.showtimes.find(
      (time) => time.showtime === showtime && time.date.toISOString() === new Date(showdate).toISOString()
    );

    if (!showtimeDetails) {
      return res.status(400).json({ message: 'Showtime not available' });
    }

    // Create a new booking
    const newBooking = new UserBooking({
      userId,
      movieName,
      cinemaName,
      showtime: showtimeDetails.showtime,
      showdate: new Date(showdate), // Ensure showdate is a Date object
    });

    // Save the booking to the database
    const savedBooking = await newBooking.save();
    res.status(200).json({ message: 'Booking Confirmed', booking: savedBooking });
  } catch (err) {
    res.status(400).json({ message: 'Error creating booking', error: err });
  }
});

// Get all bookings for a specific user
router.get('/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      const bookings = await UserBooking.find({ userId });
  
      // If no bookings are found, send a message
      if (bookings.length === 0) {
        return res.status(200).json({ message: 'No bookings!!' });
      }
  
      // If bookings are found, return the list of bookings
      res.status(200).json(bookings);
    } catch (err) {
      res.status(400).json({ message: 'Error fetching bookings', error: err });
    }
  });

  // Cancel a booking by ID
router.delete('/cancel/:bookingId', async (req, res) => {
    const { bookingId } = req.params;
  
    try {
      // Find and delete the booking by its ID
      const deletedBooking = await UserBooking.findByIdAndDelete(bookingId);
  
      // If booking not found, send a response
      if (!deletedBooking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
  
      // Send success response after deletion
      res.status(200).json({ message: 'Booking cancelled successfully', booking: deletedBooking });
    } catch (err) {
      res.status(500).json({ message: 'Error cancelling booking', error: err });
    }
  });

module.exports = router;
