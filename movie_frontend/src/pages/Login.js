import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css'; // Import the CSS for styling

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error message

    const loginData = { email, password };

    const response = await fetch('http://localhost:5001/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData),
    });

    if (response.ok) {
      const data = await response.json();
      sessionStorage.setItem('token', data.token); // Store token in local storage
      onLoginSuccess(data.user); // Pass user data on success

      // Log success message to the console
      console.log(`${data.user.name} successfully logged in`);

      navigate('/'); // Redirect to landing page after login
    } else {
      setError('Login failed, please check your credentials and try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-button">Login</button>
        </form>

        <div className="register-link">
          <p>Don't have an account?</p>
          <button className="register-button" onClick={() => navigate('/register')}>
            Register Here
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
