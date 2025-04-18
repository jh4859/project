import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import React from 'react';
import footer from '../img/footer.png'

let Footer = () => {

  const location = useLocation()

  useEffect(()=> {
    window.scrollTo(0,0)
  }, [location])

    return (
      <footer>
        <div class="footer-section">
          <div className="footer-section-sub">
            <p>이용약관</p>
            <p>개인정보처리방침</p>
          </div>
        </div>

        <hr className="footer-hr"/>
        <div className="footer-section-main">
          <div className="footer-utils">
            <div className="footer-utils-icon">
              <img src={footer} alt="footer로고" />
            </div>
            <div className="footer-utils-info">
              <div className="footer-contact">
                <p>대표자 김정현 박주호 임현주</p>
                <p>등록문의 1234-5678</p>
                <p>고객센터 9876-5432</p>
              </div>
              <p>부산광역시 부산진구 양정동 353-12 타임스퀘어빌딩 6, 7층</p>
              <span>Copyright © CAFE LABORATORY. All right Reserved.</span>
            </div>

          </div>
          <div className="footer-nav">
            <div className="footer-util-navmenu">
              <p>STORE</p>
              <Link to='/cafelist'>카페정보</Link>
            </div>
            <div className="footer-util-navmenu">
              <p>COMMUNITY</p>
              <Link to='#'>공지사항</Link>
              <Link to='#'>소통창</Link>
              <Link to='#'>FAQ</Link>
            </div>
            <div className="footer-util-icon">
              <Link to='https://www.instagram.com/'><i class="fa-brands fa-instagram"></i></Link>
              <Link to='https://www.facebook.com/'><i class="fa-brands fa-square-facebook"></i></Link>
              <Link to='https://x.com/'><i class="fa-brands fa-square-x-twitter"></i></Link>
            </div>
          </div>
        </div>
      </footer>
    );
  };

export default Footer;