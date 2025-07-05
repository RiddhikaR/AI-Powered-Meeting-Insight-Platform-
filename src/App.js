import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Uploadpage from './Uploadpage';
import Loginpage from './Loginpage';
import Signup from './Signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Loginpage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/upload" element={<Uploadpage />} />
      </Routes>
    </Router>
  );
}

export default App;
