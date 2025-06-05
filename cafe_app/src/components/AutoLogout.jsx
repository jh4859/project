import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

const AutoLogout = ({ onLogout, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const timeoutRef = useRef(null); // ⬅️ 타이머 ID 저장

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userid");
    localStorage.removeItem("userType");
    localStorage.removeItem("name");

    if (setIsLoggedIn) {
      setIsLoggedIn(false);
    }

    if (onLogout) {
      onLogout();
    }

    if (location.pathname.startsWith("/mypage")) {
      // 마이페이지에서는 이전 페이지로 이동
      if (window.history.length > 1) {
        navigate('/login'); // 이전 페이지로
      }
    } else if (location.pathname.startsWith("/admin")) {
      // 관리자 페이지에서는 로그인 페이지로 이동
      navigate("/login");
    } else {
      // 기타 페이지에서는 현재 페이지에서 로그아웃 처리
      window.location.reload(); // 현재 페이지 새로고침
    }
  };

  const showAlert = (message) => {
    const confirmLogout = window.confirm(message);
    if (confirmLogout) {
      handleLogout();
      window.location.reload();
    }
  };

  const checkTokenExpiration = () => {
    const token = localStorage.getItem("token");

    if (token) {
      const expired = isExpired(token);

      if (expired) {
        showAlert("자동 로그아웃 되었습니다. 다시 로그인해주세요.");
      } else {
        timeoutRef.current = setTimeout(checkTokenExpiration, 7200000); // ✅ 저장
      }
    } else {
      console.log("⚠️ 저장된 토큰 없음");
    }
  };

  const isExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp && payload.exp < now;
    } catch (e) {
      console.error("❌ 토큰 파싱 에러:", e);
      return true;
    }
  };

  useEffect(() => {
    checkTokenExpiration();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current); // ✅ 타이머 클리어
      }
    };
  }, [location]);

  return <div className="autoLogout-container"></div>;
};

export default AutoLogout;
