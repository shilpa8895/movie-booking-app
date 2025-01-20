import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/bookNow.css';

function BookNow({ user }) {
  const { movieId } = useParams(); // Get the movie ID from the URL
  const [movie, setMovie] = useState(null);
  const [cinemas, setCinemas] = useState([]);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // State for showing the modal
  const [modalContent, setModalContent] = useState({}); // State to hold modal content
  const [bookingConfirmed, setBookingConfirmed] = useState(false); // State to track booking confirmation

  // Fetch movie details
  useEffect(() => {
    fetch(`http://localhost:5001/movies/${movieId}`)
      .then((response) => response.json())
      .then((data) => setMovie(data))
      .catch((error) => setError(error.message));
  }, [movieId]);

  // Fetch cinemas for the movieId
  useEffect(() => {
    fetch(`http://localhost:5001/cinemas/movie/${movieId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.message && data.message === "No cinemas found for this movie") {
          setError("No cinemas found for this movie.");
        } else {
          setCinemas(data);
          setError(null); // Clear any previous errors if cinemas are found
        }
      })
      .catch((error) => setError(error.message));
  }, [movieId]);

  // Handle cinema selection
  const handleCinemaSelect = (cinemaId) => {
    setSelectedCinema(cinemaId); // Set selected cinema when clicked
    const selectedCinemaDetails = cinemas.find(cinema => cinema._id === cinemaId);
    
    // Reset the showtime state when a new cinema is selected
    setSelectedShowtime(null);
    
    if (selectedCinemaDetails && selectedCinemaDetails.showtimes.length > 0) {
      // Optionally, you can set the first available showtime automatically.
      setSelectedShowtime(selectedCinemaDetails.showtimes[0]);
    }
  };

  // Handle showtime selection
  const handleShowtimeSelect = (showtime) => {
    setSelectedShowtime(showtime);
  
    if (selectedCinema) {
      const selectedCinemaDetails = cinemas.find(cinema => cinema._id === selectedCinema);
   
      setModalContent({
        movieId: movieId,
        movieName: movie.movie_name,
        cinemaName: selectedCinemaDetails?.cinema_name,
        showtime: showtime.showtime,
        showdate: new Date(showtime.date).toLocaleDateString(), // Convert the date to a readable format
      });
      setShowModal(true); // Show the modal
    }
  };
  

  // Confirm the booking and show confirmation
  const confirmBookingModal = () => {
    const userId = user?._id;  // Ensure userId is set properly
    const showdate = modalContent?.showdate; // Ensure showdate is set
    // Log to debug
    console.log('User:', user);
    console.log('Modal Content:', modalContent);

    const bookingDetails = {
      userId: user.userid,
      movieName: modalContent.movieName,
      cinemaName: modalContent.cinemaName,
      showtime: modalContent.showtime,
      showdate: modalContent.showdate
    };
  
    console.log('Booking Details:', bookingDetails); // Debugging the booking details

    fetch('http://localhost:5001/bookings/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingDetails), // Send the booking details as JSON
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('API Response:', data); // Log the API response for debugging
        if (data.success) {
          setBookingConfirmed(true);
        } else {
          setError('Booking confirmation failed: ' + (data.message || 'Unknown error'));
        }
      })
      .catch((error) => {
        console.error('Error during booking:', error);
        setError('An error occurred while confirming the booking');
      });
  };



  // Close the modal
  const closeModal = () => {
    setShowModal(false); // Close the modal
    setBookingConfirmed(false); // Reset booking confirmation state
  };

  // Check if movie is available
  if (!movie) {
    return <p>Loading movie details...</p>;
  }

  return (
    <div className="book-now-page">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>{user ? user.name : 'Guest'}</h3>
        </div>
        <div className="sidebar-links">
          {/* <a href="/my-account">My Account</a> */}
          {/* <a href="/my-bookings">My Bookings</a> */}
          <a href="/">Logout</a>
        </div>
      </div>

      <div className="content">
        <header>
          <h1>Book Your Movie Ticket</h1>
          <h4>Movie: {movie.movie_name}</h4>
        </header>

        {/* Error message */}
        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {/* Cinema Selection */}
        {cinemas.length === 0 && !error && (
          <div className="no-cinemas">
            <p className="error-message">
              No cinemas available for booking for this movie.
            </p>
          </div>
        )}

        {cinemas.length > 0 && !error && (
          <div className="cinema-selection">
            <h2>Select Your Cinema</h2>
            <div className="cinema-list">
              {cinemas.map((cinema) => (
                <div
                  key={cinema._id}
                  className={`cinema-item ${selectedCinema === cinema._id ? 'selected' : ''}`}
                  onClick={() => handleCinemaSelect(cinema._id)} // Set selected cinema
                >
                  <h3>{cinema.cinema_name}</h3>
                  {selectedCinema === cinema._id && (
                    <div className="showtimes">
                      <h4>Available Showtimes:</h4>
                      {cinema.showtimes.length === 0 ? (
                        <p>No showtimes available.</p>
                      ) : (
                        cinema.showtimes.map((showtime, index) => (
                          <button
                            key={index}
                            className="showtime-btn"
                            onClick={() => handleShowtimeSelect(showtime)} // Handle showtime selection
                          >
                            {showtime.showtime} - {new Date(showtime.date).toLocaleDateString()}
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Popup */}
        {showModal && !bookingConfirmed && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Booking Details</h3>
              <p><strong>Movie:</strong> {modalContent.movieName}</p>
              <p><strong>Cinema:</strong> {modalContent.cinemaName}</p>
              <p><strong>Showtime:</strong> {modalContent.showtime}</p>
              <p><strong>Showdate:</strong> {modalContent.showdate}</p>
              <button onClick={confirmBookingModal}>Confirm Booking</button>
            </div>
          </div>
        )}

        {/* Confirmation Popup */}
        {bookingConfirmed && (
          <div className="modal-overlay">
            <div className="modal-content">
              <p style={{ fontWeight: 'bold' }}>Booking Confirmed!!</p>
              <button onClick={closeModal}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookNow;
