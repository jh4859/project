import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import './App.css'
import './style/Nav.css'
import './style/Footer.css'
import './style/Cafemain.css'

import './style/admin/login.css'
import './style/admin/Signup.css'
import './style/admin/mypage.css'

import './style/cafe/CafeList.css'
import './style/cafe/CafeDetail.css'
import './style/cafe/CafeUpload.css'


import './style/community/communityPage.css'
import './style/community/WritePage.css'
import './style/community/DetailPage.css'
import './style/community/FaqPage.css'
import './style/community/Tabs.css'


import './style/master/admin.css'
import './style/master/admin-bord-1.css'
import './style/master/admin-bord-2.css'
import './style/master/admin-bord-3.css'
import './style/master/admin-bord-4.css'
import './style/master/admin-list-0.css'
import './style/master/admin-list-1.css'
import './style/master/admin-list-3.css'

import { BrowserRouter as Router, Routes, Route, useLocation  } from "react-router-dom";
import AutoLogout from './components/AutoLogout';
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Cafemain from './components/Cafemain'

import Login from './components/admin/login'
import Signup from './components/admin/Signup'
import MyPage from './components/admin/mypage'

import CafeProvider from "./components/CafeProvider";
import CafeList from "./components/cafe/CafeList";
import CafeUpload from "./components/cafe/CafeUpload";
import CafeDetail from "./components/cafe/CafeDetail";

import BoardPage from './components/community/BoardPage';
import WritePage from './components/community/WritePage';
import DetailPage from './components/community/DetailPage';

import Admin from './components/master/admin';
import AdminBord_1 from './components/master/admin-bord-1';
import AdminBord_2 from './components/master/admin-bord-2';
import AdminBord_3 from './components/master/admin-bord-3';
import AdminBord_4 from './components/master/admin-bord-4';
import AdminList_0 from './components/master/admin-list-0';
import AdminList_1 from './components/master/admin-list-1';
import AdminList_3 from './components/master/admin-list-3';


const Main = () => {
  const location = useLocation();  // useLocation 훅은 Router 내에서 사용해야 함
  const navigate = useNavigate();

  // Cafemain 페이지에서만 Nav를 숨김
  const showNav = location.pathname !== '/';
  const showNav2 = location.pathname !== '/login';
  const showNav3 = location.pathname !== '/signup';
  const showNav4 = location.pathname !== '/admin/dash';
  const showNav5 = location.pathname !== '/admin/list/0';
  const showNav6 = location.pathname !== '/admin/list/1';
  const showNav11 = location.pathname !== '/admin/list/3';
  const showNav7 = location.pathname !== '/admin/Bord/1';
  const showNav8 = location.pathname !== '/admin/Bord/2';
  const showNav9 = location.pathname !== '/admin/Bord/3';
  const showNav10 = location.pathname !== '/admin/Bord/4';

  const showfooter = location.pathname !== '/';
  const showfooter2 = location.pathname !== '/login';
  const showfooter3 = location.pathname !== '/signup';
  const showfooter4 = location.pathname !== '/admin/dash';
  const showfooter5 = location.pathname !== '/admin/list/0';
  const showfooter6 = location.pathname !== '/admin/list/1';
  const showfooter11 = location.pathname !== '/admin/list/3';
  const showfooter7 = location.pathname !== '/admin/Bord/1';
  const showfooter8 = location.pathname !== '/admin/Bord/2';
  const showfooter9 = location.pathname !== '/admin/Bord/3';
  const showfooter10 = location.pathname !== '/admin/Bord/4';


  return (
    <div className="container">
      {/* Nav가 'Cafemain' 페이지에서만 숨겨지도록 조건부 렌더링 */}
      {showNav && showNav2 && showNav3 && showNav3 && showNav4 &&showNav5 &&showNav6 &&showNav7 &&showNav8 &&showNav9 && showNav10 && showNav11 &&<Nav />}
  
      <Routes>
        <Route path='/' element={<Cafemain />} />

        <Route path='/cafelist' element={<CafeList />} />
        <Route path='/cafeupload' element={<CafeUpload />} />
        <Route path="/cafeedit/:id" element={<CafeUpload />} />
        <Route path='/cafedetail/:id' element={<CafeDetail />} />

        <Route path="/:category" element={<BoardPage />} /> */
        <Route path="/:category/add" element={<WritePage />} />
        <Route path="/edit/:category/:postId" element={<WritePage />} />
        <Route path="/:category/:postId" element={<DetailPage />} />

        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/mypage' element={<MyPage />} />   
             
        <Route path="/admin/dash" element={<Admin />} />
        <Route path="/admin/list/0" element={<AdminList_0 />} />
        <Route path="/admin/list/1" element={<AdminList_1 />} />
        <Route path="/admin/list/3" element={<AdminList_3 />} />
        <Route path="/admin/Bord/1" element={<AdminBord_1 />} />
        <Route path="/admin/Bord/2" element={<AdminBord_2 />} />
        <Route path="/admin/Bord/3" element={<AdminBord_3 />} />
        <Route path="/admin/Bord/4" element={<AdminBord_4 />} />

      </Routes>
      {showfooter && showfooter2 && showfooter3 && showfooter4 &&showfooter5 &&showfooter6 &&showfooter7 &&showfooter8 &&showfooter9 &&showfooter10 && showfooter11 &&<Footer/>}
    </div>
  );
};


function App() {
  return (

      <Router>
        <CafeProvider>
          
              <AutoLogout/>
              <Main />

        </CafeProvider>
      </Router>

  )
}

export default App