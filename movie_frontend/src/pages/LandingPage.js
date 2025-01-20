import React from 'react';
import { Link } from 'react-router-dom';
import Movie from './Movie';  // Reusing your Movie component
import '../styles/landingPage.css'; 

function LandingPage({ user, onLogout }) {
  return (
    <div className="landing-page">
      <header className="header">
        <h1 className="app-heading">Movie Booking App</h1>
        {/* <div className="search-bar-container">
          <input type="text" placeholder="Search for movies..." className="search-bar" />
        </div> */}
        {user ? (
          <div className="welcome-message">
            Welcome, {user.name || user.email}! {/* Show user's name or email */}
            <button className="login-button" onClick={onLogout}>Logout</button>
          </div>
        ) : (
          <Link to="/login" className="login-button">Login</Link>
        )}
      </header>

      <section className="movie-list">
        <h2 className="movie-list-heading">Featured Movies</h2>
        <Movie /> {/* Embed the Movie component here */}
      </section>
    </div>
  );
}

export default LandingPage;


