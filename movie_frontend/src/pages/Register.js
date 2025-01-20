import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/register.css'; // Assuming you have a separate CSS file for the register page

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match!');
      return;
    }

    // Proceed to register the user
    fetch('http://localhost:5001/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password }),
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        setSuccessMessage('Registration successful! You will be redirected to the login page.');
        setTimeout(() => navigate('/login'), 3000);  // Redirect to login after 3 seconds
      } else {
        setErrorMessage('Registration failed, please try again.');
      }
    })
    .catch((error) => console.error('Error registering:', error));
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Create an Account</h2>
        
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label>Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Enter your full name" 
              required 
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Enter your email" 
              required 
            />
          </div>

          <div className="input-group">
            <label>Phone</label>
            <input 
              type="text" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              placeholder="Enter your phone number" 
              required 
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Enter your password" 
              required 
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              placeholder="Re-enter your password" 
              required 
            />
          </div>

          <button type="submit" className="register-button">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
