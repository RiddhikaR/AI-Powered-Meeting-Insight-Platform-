import React, { useState } from 'react';
import './Login.css'; // 👈 import custom CSS

function Loginpage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/login/loggingin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = '/upload';
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };
  


  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        <input
          className="login-input"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />
        <input
          className="login-input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br /><br></br>
        
<p>Don't have an account?
<a
  style={{ textDecoration: 'underline', cursor: 'pointer',color:'#24269a' }}
  onClick={() => window.location.href = '/signup'}
>
  Sign Up
</a></p>

        <button className="explore-button" onClick={login}>Login</button>
      </div>
    </div>
  );
}

export default Loginpage;
