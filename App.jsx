import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useLocation} from 'react-router-dom';


import "./App.css"
import './css/Nav.css'
import './css/Footer.css'
import './css/Cafemain.css'
import './css/cafe/CafeList.css'
import './css/Tabs.css'
import './css/community/communityPage.css'
import './css/community/FaqPage.css'
import './css/community/WritePage.css'
import './css/community/DetailPage.css'


import Nav from './components/Nav';
import CafeProvider from './components/CafeProvider';
import Cafemain from './components/Cafemain'
import CafeList from './components/cafe/CafeList'
import BoardPage from './components/community/BoardPage';
import WritePage2 from './components/community/WritePage2';
import DetailPage from './components/community/DetailPage';
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
        {/* <Route path="/notice" element={<NoticePage />} />
        <Route path="/:category" element={<ChatPage />} />
        <Route path="/:category" element={<FaqPage />} /> */}
        <Route path="/:category" element={<BoardPage />} /> */
        <Route path="/:category/add" element={<WritePage2 />} />
        <Route path="/:category/:postId" element={<DetailPage />} />
        {/* <Route path="/sample" element={<Sample />} /> */}
        {/* <Route path="/community/add" element={<Write />} /> */}
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
