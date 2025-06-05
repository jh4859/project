import React from 'react';


import { useContext, useEffect, useState } from "react";
import { NavLink ,Link, useLocation,matchPath } from "react-router-dom";
import { CafeContext } from "./CafeProvider";
import { useNavigate } from "react-router-dom";
import AutoLogout from './AutoLogout';  // ✅ AutoLogout 임포트

let Nav = () => {


  // store랑 community 경로마다 배경 이미지 및 텍스트 설정
  const location = useLocation()
  const {handleResetFilter} = useContext(CafeContext)

  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("");
  const [userId, setUserId] = useState("");
    const [userType, setUserType] = useState(null);

// 자동 로그아웃 시 실행되는 콜백 함수
const onLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("nickname");
  localStorage.removeItem("userid");
  localStorage.removeItem("userType");
  setIsLoggedIn(false); // ✅ 상태 반영
  setNickname("");
  setUserId("");
  setUserType(null);
  navigate("/login");
};


 

useEffect(() => {
  const token = localStorage.getItem("token");
  const storedNickname = localStorage.getItem("nickname");
  const storedUserId = localStorage.getItem("userid");
  const storedUserType = localStorage.getItem("userType");

  setIsLoggedIn(!!token);
  setNickname(storedNickname || "");
  setUserId(storedUserId || "");
  setUserType(storedUserType);
}, [location.pathname]);


  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nickname");
    localStorage.removeItem("userid");
    const userType = localStorage.getItem("userType");  // 로그아웃 전에 userType 가져오기
    setIsLoggedIn(false);
    setNickname("");
  
    // 현재 경로가 '/mypage'인 경우에만 메인으로 이동
    if (location.pathname === "/mypage") {
      if (userType === "1") {
        navigate("/cafelist");  // 카페사장
      } else {
        navigate("/notice");    // 일반회원
      }
    } else {
      // `/mypage` 외의 다른 경로에서
      if (userType === "1") {
        navigate("/cafelist");  // 카페사장일 때
      } else {
        navigate("/notice");    // 일반회원일 때
      }
    }
  };

  // 기본값 설정
  let heroImage;
  let heroText = {title:'', subtitle:''}

  if (location.pathname == '/cafelist' || location.pathname == '/cafeupload' || location.pathname.startsWith('/cafedetail/') || location.pathname.startsWith('/cafeedit/')){
    heroImage = 'url(/hero5.jpg)';
    heroText = {
      title : 'STORE',
      subtitle : '좋은 커피와 서비스를 제공하는 카페 정보를 제공합니다'
    }
  } else if (location.pathname === '/notice' || location.pathname === '/chat' || location.pathname === '/faq' || location.pathname.startsWith('/edit/')) {
    heroImage = `url(/c6.jpg)`;
    heroText = {
      title: 'COMMUNITY',
      subtitle: '정보를 공유하고 서로 의견을 주고받아보세요',
    };
  } else if (
    matchPath('/:category/add', location.pathname) || 
    matchPath('/:category/:postId', location.pathname)
  ) {
    heroImage = `url(/c6.jpg)`;
    heroText = {
      title: 'COMMUNITY',
      subtitle: '정보를 공유하고 서로 의견을 주고받아보세요'
    };
  }else{
    heroImage='';
    heroText = {title : '', subtitle : ''}
  }

  const hideHero = location.pathname ==='/mypage';

  // STORE에 해당하는 모든 경로
  const isStoreActive = location.pathname.startsWith('/cafelist') ||
  location.pathname.startsWith('/cafeupload') ||
  location.pathname.startsWith('/cafeedit') ||
  location.pathname.startsWith('/cafedetail');

  // COMMUNITY 관련 경로들
  const isCommunityActive = (() => {
    const path = location.pathname;
    // `/login`, `/signup`, `/mypage` 같은 건 제외하고
    const excluded = ['/login', '/signup', '/mypage'];
    if (excluded.includes(path)) return false;
  
    // `/admin/...` 도 제외
    if (path.startsWith('/admin')) return false;
  
    // `/cafe...` 도 제외
    if (path.startsWith('/cafe')) return false;
    
  
    // 그 외의 1차 경로는 커뮤니티일 확률 높음
    const firstPath = path.split('/')[1];
    return ['notice', 'faq', 'free', 'event', 'chat', 'edit'].includes(firstPath);
  })();

  // 마이페이지 클릭 시 관리자 페이지로 리디렉션하는 함수
  const handleMyPageClick = () => {
    if (userType === "3") { // 관리자(3)일 경우
      navigate("/admin/dash"); // 관리자 페이지로 이동
    } else if (userType === "1") { // 카페 사장(1)일 경우
      navigate("/mypage"); // 카페 사장의 마이페이지로 이동
    } else if (userType === "0") { // 일반 회원(0)일 경우
      navigate("/mypage"); // 일반 회원의 마이페이지로 이동
    }
  };


  return(
    <>
      <header>
        <nav>
            <div className="menu">
                <div className="menu-left">
                    <div className="menu-logo">
                      <Link to={'/'}>
                        <img src="/logo.png" alt="로고" />
                      </Link>
                    </div>
                    <div className="menu-store">
                      <NavLink to={'/cafelist'} onClick={handleResetFilter} className={`menu-link ${isStoreActive ? 'active' : ''}`}>
                        STORE
                      </NavLink>
                      <NavLink to={'/notice'} className={`menu-link ${isCommunityActive ? 'active' : ''}`}>
                        COMMUNITY
                      </NavLink>
                    </div>
                </div>
                <div className="menu-right">
                  <div className="menu-login">
                  {isLoggedIn ? (
                  <>
                    <span className='nav-nickname'>{nickname}</span>
                    <span className="nav-nim">님</span>
                    <span className="nav-divider">|</span>
                    <Link to="#" onClick={(e) => {e.preventDefault(); handleLogout();}}>LOGOUT</Link>
                    <span className="nav-divider">|</span>
                    <Link to="#" onClick={(e) => { e.preventDefault(); handleMyPageClick(); }}>MY PAGE</Link>
                  </>
                  ) : (
                  <>
                    <Link to={"/login"}>LOGIN</Link>
                    <span className="nav-divider">|</span>
                    {/* <Link to={"/mypage"}>MY PAGE</Link> */}
                    <Link to={"/signup"}>JOIN</Link>
                  </>
                  )}
                  </div>
                  <div className="social-icons">
                    <a href='https://www.instagram.com/' target="_blank"><i class="fa-brands fa-instagram"></i></a>
                    <a href='https://www.facebook.com/' target="_blank"><i class="fa-brands fa-square-facebook"></i></a>
                    <a href='https://x.com/' target="_blank"><i class="fa-brands fa-square-x-twitter"></i></a>
                  </div>
                </div>
            </div>
        </nav>
      </header>

      {!hideHero && (
      <div className="hero" style={{backgroundImage:heroImage}}>
        <div className="hero-section">
            <div className="hero-content">
                <p>{heroText.title}</p>
                <p>{heroText.subtitle}</p>
            </div>
        </div>
      </div>
      )}
    {/* 자동 로그아웃 컴포넌트 추가 */}
   <AutoLogout onLogout={onLogout} setIsLoggedIn={setIsLoggedIn} />
    </>      
    )
  }

export default Nav;