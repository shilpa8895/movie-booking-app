import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate for navigation
import '../styles/movie.css';  // Import the CSS file for styles

function Movie() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate(); // Use navigate for redirection

  // Fetch movie data from the backend
  useEffect(() => {
    fetch('http://localhost:5001/movies')  // Fetch from the backend
      .then((response) => response.json())
      .then((data) => {
        setMovies(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching movies:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading movies...</p>;
  }

  // Search movies by title
  const filteredMovies = movies.filter((movie) =>
    movie.movie_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Book Now click, check login status
  const handleBookNow = (movieId) => {
    const token = sessionStorage.getItem('token'); // Check if user is logged in (via token)

    if (token) {
      // Redirect to booking page if logged in
      navigate(`/book-now/${movieId}`);
    } else {
      // Redirect to login page if not logged in
      navigate('/login');
    }
  };

  return (
    <div className="movie-container">
      <div className="movie-cards">
        {filteredMovies.length === 0 ? (
          <p>No movies available.</p>
        ) : (
          filteredMovies.map((movie) => (
            <div className="movie-card" key={movie._id}>
              <img src={movie.image} alt={movie.movie_name} className="movie-image" />
              <div className="movie-info">
                <h3>{movie.movie_name}</h3>
                <p>{movie.synopsis}</p>
                <div className="movie-buttons">
                  {/* View Details button */}
                  <button 
                    className="btn-view-details" 
                    onClick={() => navigate(`/movie/${movie._id}`)}
                  >
                    View Details
                  </button>
                  {/* Book Now button */}
                  <button 
                    className="btn-book-now" 
                    onClick={() => handleBookNow(movie._id)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Movie;
