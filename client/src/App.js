// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import Signup from './pages/Signup'
import Signin from './pages/Signin';
import Dashboard from './pages/Dashboard';
import Communities from './pages/Communities';
import Viewusers from './pages/Viewuser';
import Leaderboard from './pages/Leaderboard';
import Awareness from './pages/Awareness';
import Support from './pages/Support';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Signup/>}></Route>
          <Route path="/signup" element={<Signup/>}></Route>
          <Route path="/signin" element={<Signin/>}></Route>
          <Route path="/leaderboard" element={<Leaderboard/>}></Route>
          <Route path="/support" element={<Support/>}></Route>
          <Route path="/awareness" element={<Awareness/>}></Route>
          <Route path="/communities/:userID" element={<Communities/>}></Route>
          <Route path="/viewuser/:userID" element={<Viewusers/>}></Route>
          <Route path="/dashboard/:userID" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
