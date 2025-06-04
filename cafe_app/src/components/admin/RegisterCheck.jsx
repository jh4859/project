import React, { useState } from "react";
import "../../style/admin/RegisterCheck.css";

const RegisterCheck = ({ onSuccess }) => {
  const [inputPassword, setInputPassword] = useState("");

  const checkPassword = async (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 리로드를 막습니다.

    // localStorage에서 token을 가져옴
    const token = localStorage.getItem("token");

    // 토큰이 없을 경우 알림을 띄우고 함수 실행을 중단
    if (!token) {
      alert("로그인이 필요합니다. 다시 로그인해주세요.");
      return;
    }

    try{
    const response = await fetch("http://localhost:8080/api/check-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // JWT 토큰 포함
      },
      body: JSON.stringify({ password: inputPassword }),
    });

    // 응답이 정상적으로 왔을 경우
    const data = await response.json();
    console.log("응답 데이터:", data); // 응답 데이터 콘솔에 출력

    if (response.ok) {
      console.log("비밀번호 일치", data);
      alert("비밀번호가 확인되었습니다."); // 비밀번호 일치 시 알림 추가
      onSuccess(); // 비밀번호가 맞으면 onSuccess 호출
    } else {
      console.log("비밀번호 불일치", data.message);
      alert(data.message); // 비밀번호 불일치 시 메시지 출력
    }
    }catch (error) {
        console.error("요청 중 오류가 발생했습니다:", error);
    }
  };

  return (
    <div className="register-check-container">
      <h2>비밀번호 확인</h2>
      <form className="register-check-password-form" onSubmit={checkPassword}>
        <input
          className="register-check-password-input"
          type="password"
          value={inputPassword}
          onChange={(e) => setInputPassword(e.target.value)}
          placeholder="비밀번호 입력"
        />
        <button
          className="register-check-confirm-button"
          type="submit"
        >
          확인
        </button>
      </form>
    </div>
  );
};

export default RegisterCheck;
