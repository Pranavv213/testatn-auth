import React from 'react'
import Auth_Referral from './Auth_Referral'
import Home from './Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Router>
    <Routes>
    
      <Route path="/:referralCode?" element={<Auth_Referral />} />
      <Route path="/Home" element={<Home />} />
   
    </Routes>
  </Router>
  )
}

export default App
