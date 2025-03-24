import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css"
import './css/Nav.css'
import './css/Tabs.css'
import './css/Board.css'
import './css/CommunityPage.css'
import './css/AddBoard.css'

import Nav from './components/Nav';
import CommunityPage from './components/CommunityPage'
import AddBoard from './components/AddBoard';

function App() {
  return (
    <>
      <Router>
        <div className="container">
        <Nav />
          <Routes>
            <Route path='/' element={<CommunityPage />} />
            <Route path='/write' element={<AddBoard />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;