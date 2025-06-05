import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import '../../style/admin/PasswordChange.css'

const PasswordChange = () => {
  const navigate = useNavigate();
  const [isPasswordValid, setIsPasswordValid] = useState(null); //비밀번호 입력시 조건필요한 부분
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(null); //비밀번호 중복확인상태

// 비밀번호 눈 아이콘 토글을 위한 상태
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

// 입력한 실제 값 저장하기 위한 상태
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

// 에러 메시지 상태
    const [currentErrorMessage, setCurrentErrorMessage] = useState("");
    const [confirmErrorMessage, setConfirmErrorMessage] = useState("");

// 커서 이동
    const currentPasswordRef = useRef(null);
    const confirmPasswordRef = useRef(null);


    const handleSubmit = async (e) => {
        e.preventDefault();
      
        const token = localStorage.getItem("token");
        if (!token) {
          alert("로그인이 필요합니다.");
          return;
        }
        console.log("사용자 토큰:", token);
      
        // 비밀번호 유효성 검사
        const validatePassword = () => {
          const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*])[A-Za-z\d~!@#$%^&*]{8,}$/;
          const isValid = regex.test(newPassword);
          setIsPasswordValid(isValid);
          return isValid;
        };
      
        // 비밀번호 확인 검사
        const validateConfirmPassword = () => {
          const isMatch = confirmPassword === newPassword;
          setIsConfirmPasswordValid(isMatch);
          return isMatch;
        };
      
        // 실제 검증 실행
        if (!validatePassword()) {
          alert("비밀번호는 최소 8자 이상, 영어, 숫자, 특수문자를 포함해야 합니다.");
          return;
        }
      
        if (!validateConfirmPassword()) {
          alert("입력하신 새 비밀번호와 일치하지 않습니다.");
          setConfirmErrorMessage("입력하신 새 비밀번호와 일치하지 않습니다.");
          confirmPasswordRef.current.focus();
          return;
        }
      
        const confirm = window.confirm("정말 비밀번호를 변경하시겠습니까?");
        if (!confirm) return;
      
        try {
          const response = await fetch("http://localhost:8080/api/change-password", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
              currentPassword,
              newPassword,
            }),
          });
          console.log("Authorization header:", `Bearer ${token}`);
      
          const data = await response.json();
      
          if (response.ok) {
            alert("비밀번호가 성공적으로 변경되었습니다.");
            navigate("/mypage");
            window.location.reload();
          } else {
            if (data.message === "현재 비밀번호가 틀렸습니다.") {
              alert("현재 비밀번호가 일치하지 않습니다.");
              setCurrentErrorMessage(data.message);
              currentPasswordRef.current.focus();
            } else {
              alert(data.message || "비밀번호 변경 실패");
            }
          }
        } catch (error) {
          console.error("에러 발생:", error);
          alert("서버와의 통신 중 문제가 발생했습니다.");
        }
      };

  return (
    <div className="mypage-password-change">
      <h2 className="mypage-password-change-h2">비밀번호 변경</h2>
      <form className="mypage-password-form" onSubmit={handleSubmit}>
        <div className="password-input-with-icon">
          <label>현재 비밀번호</label>
          <input type={currentPasswordVisible ? "text" : "password"} placeholder="현재 비밀번호 입력" value={currentPassword} 
            onChange={(e)=> {setCurrentPassword(e.target.value); setCurrentErrorMessage("");}}
            className={currentErrorMessage ? "password-input-error" : ""}
            ref={currentPasswordRef}
          />
          <i className={`fa-solid ${currentPasswordVisible ? "fa-eye-slash" : "fa-eye"}`} onClick={() => setCurrentPasswordVisible(prev => !prev)}></i>
          {currentErrorMessage && <p className="password-error-text">{currentErrorMessage}</p>}
        </div>

        <div className="password-input-with-icon">
          <label>새 비밀번호</label>
          <input type={newPasswordVisible ? "text" : "password"} placeholder="8자 이상, 영어, 숫자, 특수문자를 포함" value={newPassword} onChange={(e)=> setNewPassword(e.target.value)}/>
          <i className={`fa-solid ${newPasswordVisible ? "fa-eye-slash" : "fa-eye"}`} onClick={() => setNewPasswordVisible(prev => !prev)}></i>
        </div>

        <div className="password-input-with-icon">
          <label>새 비밀번호 확인</label>
          <input type={confirmPasswordVisible ? "text" : "password"} placeholder="비밀번호를 한번 더 입력해주세요" value={confirmPassword} 
            onChange={(e)=> {setConfirmPassword(e.target.value); setConfirmErrorMessage("");}}
            className={confirmErrorMessage ? "password-input-error" : ""}
            ref={confirmPasswordRef}
          />
          <i className={`fa-solid ${confirmPasswordVisible ? "fa-eye-slash" : "fa-eye"}`} onClick={() => setConfirmPasswordVisible(prev => !prev)}></i>
          {confirmErrorMessage && <p className="password-error-text">{confirmErrorMessage}</p>}
        </div>

        <button type="submit" className="mypage-password-change-form">변경하기</button>
      </form>
    </div>
  );
};

export default PasswordChange;
