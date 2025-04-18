import React from 'react';
import { useLocation } from 'react-router-dom';

const Hero = () => {
  const location = useLocation();
  
  let heroImage;
  
  // 페이지 경로에 따라 다른 이미지를 설정
  if (location.pathname === '/community') {
    heroImage = '../img/001.jpg';  // Community 페이지에 대한 이미지
  } else if (location.pathname === '/cafelist') {
    heroImage = '../img/004.jpg';  // CafeList 페이지에 대한 이미지
  } else {
    heroImage = '../img/default.jpg';  // 기본 이미지
  }

  return (
    <div className="hero" style={{ backgroundImage: `url(${heroImage})` }}>
      {/* 여기에 Hero 컴포넌트 내용 */}
    </div>
  );
};

export default Hero;