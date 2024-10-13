import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Login() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username) {
      sessionStorage.setItem('username', username);
      navigate('/quiz');
    } else {
      alert("Please enter your username!");
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">Login</h1>
      <div className="form-container">
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          placeholder="Enter your username"
          className="login-input"
        />
        <button onClick={handleLogin} className="login-button">Login</button>
      </div>
    </div>
  );
}

export default Login;
