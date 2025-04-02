import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import "./App.css"
import './css/Nav.css'
import './css/community/communityPage.css'
import './css/community/WritePage.css'
import './css/community/DetailPage.css'
import './css/Cafemain.css'
import './css/cafe/CafeList.css'
import './css/Footer.css'
import './css/Tabs.css'

import Cafemain from './components/Cafemain'
import Nav from './components/Nav';
import CafeProvider from './components/CafeProvider';
import NoticePage from './components/community/NoticePage';
import ChatPage from './components/community/ChatPage';
import FaqPage from './components/community/FaqPage';
import WritePage from './components/community/WritePage';
import DetailPage from './components/community/DetailPage';
import CafeList from './components/cafe/CafeList'
import Footer from './components/Footer'


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
        <Route path="/community/:category/add" element={<WritePage />} />
        <Route path="/community/:category/:postId" element={<DetailPage />} />
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
