import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import "./App.css"
import './css/Nav.css'
import './css/CommunityPage.css'
import './css/AddBoard.css'
import './css/DetailBoard.css'
import './Cafemain.css'
import './CafeList.css'
import './Footer.css'


import Nav from './components/Nav';
import CommunityPage from './components/CommunityPage'
import AddBoard from './components/AddBoard';
import DetailBoard from './components/DetailBoard';
import Cafemain from './Cafemain'
import CafeList from './CafeList'
import CafeProvider from './CafeProvider';
import Footer from './Footer'

const Main = () => {
  const location = useLocation();  // useLocation 훅은 Router 내에서 사용해야 함
  
  // Cafemain 페이지에서만 Nav를 숨김
  const showNav = location.pathname !== '/';
  
  return (
    <div className="container">
      {/* Nav가 'Cafemain' 페이지에서만 숨겨지도록 조건부 렌더링 */}
      {showNav && <Nav />}
  
      <Routes>
        <Route path='/' element={<Cafemain />} /> {/* exact 제거 */}
        <Route path='/cafelist' element={<CafeList />} />
        <Route path='/community' element={<CommunityPage />} />
        <Route path='/write' element={<AddBoard />} />
        <Route path="/community/:postId" element={<DetailBoard />} />
      </Routes>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <CafeProvider>
        <Main />
      </CafeProvider>
    </Router>
  );
};

export default App;
