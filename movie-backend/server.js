const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes'); 
const cinemaRoutes = require('./routes/cinemaRoutes'); 
const bookingRoutes = require('./routes/bookingRoutes');
const cors = require('cors');
const path = require('path');

// Initialize Express app
const app = express();

// Middleware
// Middleware
app.use(cors()); 
app.use(bodyParser.json());

// MongoDB connection string
const mongoURI = 'mongodb://localhost:27017/movie_app';
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Serve static files from "movie_frontend/public" folder
app.use('/movies', express.static(path.join(__dirname, '../movie_frontend/public/movies')));

// Use movie routes
app.use('/users', userRoutes);
app.use('/movies', movieRoutes);
app.use('/cinemas', cinemaRoutes);
app.use('/bookings', bookingRoutes);

// Set the port and start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
