import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setSession, getSession } from '../SessionManager';  
import "../CSS/Login.css"; // Importing the CSS file


function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState('');
  const [formError, setFormError] = useState(''); // State for form error message
  const SERVER_URL = 'http://localhost:8000';

  // Redirect if already logged in
  useEffect(() => {
    const session = getSession();
    if (session) {
      navigate('/upload'); // Redirect to upload page if session exists
    }
  }, [navigate]);

  const validateUsername = (username) => {
    return username.length >= 3;
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleLogin = async () => {
    // Validate inputs
    if (!validateUsername(username)) {
      setFormError('Username must be at least 3 characters long.');
      return;
    }
    if (!validatePassword(password)) {
      setFormError(
        'Password must be at least 8 characters long, include 1 uppercase letter, 1 lowercase letter, 1 special character, and 1 number.'
      );
      return;
    }

    if (username === "Admin" && password === "112233") {
      setLoginStatus('Login successful');

      // Set the session for logged-in user
      setSession({ username });

      // Redirect to the upload page
      navigate('/upload');
    } else {
      setLoginStatus('Login failed. Invalid username or password.');
    }
  };

  return (
    <div className="login-container">
      <nav className="navbar">
        <div className="logo">NextGen Certificate Verification System</div>
        <div className="nav-links">
          <button onClick={() => navigate('/')} className="nav-btn">Home</button>
        </div>
      </nav>
      <div className="login-content">

        <div className="moving-bg"></div>
        <h1>Login</h1>
        <div className="input-group">
          <input
            type="text"
            placeholder="Username*"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <input
            type="password"
            placeholder="Password*"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="off"
            required
          />
        </div>
        <br />
        {formError && <div className="form-error">{formError}</div>}
        <div>
          <button onClick={handleLogin} className="cta-button">Login</button>
        </div>
      </div>
      {loginStatus && <div>{loginStatus}</div>}
    </div>
  );
}

export default Login;
