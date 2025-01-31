import React from 'react'
import Auth_Referral from './Auth_Referral'
import Home from './Home';
import Attend from './Attend';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Router>
    <Routes>
    
      <Route path="/" element={<Auth_Referral />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/Attend" element={<Attend />} />
      
   
    </Routes>
  </Router>
  )
}

export default App
