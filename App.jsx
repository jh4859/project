import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import "./App.css"
import './css/Nav.css'
import './css/NoticePage.css'
import './css/AddBoard.css'
import './css/DetailBoard.css'
import './Cafemain.css'
import './CafeList.css'
import './Footer.css'
import './css/Tabs.css'

import Cafemain from './Cafemain'
import Nav from './components/Nav';
import CafeProvider from './CafeProvider';
import NoticePage from './components/NoticePage';
import ChatPage from './components/ChatPage';
import FaqPage from './components/FaqPage';
import AddBoard from './components/AddBoard';
import DetailBoard from './components/DetailBoard';
import CafeList from './CafeList'
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
        <Route path="/community/notice" element={<NoticePage />} />
        <Route path="/community/chat" element={<ChatPage />} />
        <Route path="/community/faq" element={<FaqPage />} />
        <Route path="/community/:category/add" element={<AddBoard />} />
        <Route path="/community/:category/:postId" element={<DetailBoard />} />
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
