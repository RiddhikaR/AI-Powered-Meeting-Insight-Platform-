import React, { useState } from 'react';
import './Login.css'; // 👈 Reuse your existing styles

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const sign = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/login/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ Signup successful! You can now log in.');
        window.location.href = '/';
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Signup error:", err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Sign up</h2>
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
        /><br />
        

<button
  className="explore-button"
  onClick={async () => {
    await sign();  // Call your signup function
    window.location.href = '/';  // Then redirect
  }}
>
  Sign Up To Continue
</button>

        
      </div>
    </div>
  )
}

export default Signup;
