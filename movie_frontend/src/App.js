import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import components for your pages
import MovieDetails from './pages/MovieDetails';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';  
import BookNow from './pages/BookNow';


function App() {
  const [user, setUser] = useState(null); // State to store logged-in user data

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser); // Set the logged-in user data
    console.log('User logged in:', loggedInUser); 
  };
  
  const handleLogout = () => {
    setUser(null); // Clear user data on logout
    sessionStorage.removeItem('token'); // Remove token from sessionStorage
    console.log('User logged out');
  };

  // Automatically clear session storage on page load or refresh
  useEffect(() => {
    sessionStorage.removeItem('token'); 
  }, []);


  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage user={user} onLogout={handleLogout} />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/book-now/:movieId" element={<BookNow user={user} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
