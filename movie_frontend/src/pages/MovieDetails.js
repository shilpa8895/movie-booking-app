import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // For extracting the movie ID from the URL
import '../styles/movieDetails.css';


function MovieDetails() {
  const { id } = useParams(); // Get the movie ID from the URL
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch movie details based on the ID
  useEffect(() => {
    setLoading(true); // Reset loading state
    setError(false); // Reset error state
    fetch(`http://localhost:5001/movies/${id}`) // Fetch the specific movie data by ID
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch movie details');
        }
        return response.json();
      })
      .then((data) => {
        setMovie(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]); // Fetch movie details whenever the movie ID changes

  if (loading) {
    return <p>Loading movie details...</p>;
  }

  if (error || !movie) {
    return (
      <div className="error-container">
        <p>Error loading movie details. Please try again later.</p>
        <button onClick={() => window.location.reload()} className="retry-button">
          Retry
        </button>
        <button onClick={() => window.history.back()} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="movie-details-container">
      {/* Back Button */}
      <button onClick={() => window.history.back()} className="back-button">
        Go Back
      </button>

      {/* Movie Trailer */}
    <div className="movie-trailer">
        {/* Movie trailer - embedded YouTube link */}
        <iframe
            width="100%"
            height="500px"
            src={`${movie.trailer_link.replace('watch?v=', 'embed/')}?rel=0&modestbranding=1`}
            title="Movie Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
        ></iframe>
        </div>


      {/* Movie Details */}
      <div className="movie-details">
        <h2>{movie.movie_name}</h2>
        <p>
          <strong>Release Date:</strong> {new Date(movie.release_date).toISOString().split('T')[0]}
        </p>
        <p>
          <strong>Genre:</strong> {movie.genre}
        </p>
        <p>
          <strong>Synopsis:</strong> {movie.synopsis}
        </p>
        <h3>Cast and Crew:</h3>
        <div className="cast-and-crew">
          {movie.cast_and_crew.map((member, index) => (
            <div key={index} className="cast-crew-member">
              <p><strong>Director:</strong> {member.Director}</p>
              <p><strong>Actor:</strong> {member.Actor}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
