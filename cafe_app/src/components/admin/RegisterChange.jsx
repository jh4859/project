import React, { useState, useEffect  } from "react";
import "../../style/admin/RegisterChange.css"; 
import axios from "axios";

const RegisterChange = ({updateUserInfo}) => {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(null); // 이메일 유효성 상태 추가
  const [isNicknameValid, setIsNicknameValid] = useState(null); // 닉네임 중복확인 상태
  const [isLoading, setIsLoading] = useState(false); // 중복확인 로딩 상태

// 로그인한 회원 정보 상태
const [userData, setUserData] = useState({
  name: "",
  nickname: "",
  email: "",
  userType: null
});


// JWT 토큰을 이용하여 사용자 정보 가져오기
useEffect(() => {
  const token = localStorage.getItem("token"); // JWT 토큰 가져오기
  if (token) {
    fetch("http://localhost:8080/api/user", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`, // JWT 토큰을 Authorization 헤더에 포함
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("서버 응답 데이터:", data);  // 응답 데이터를 확인
        // 서버로부터 받은 사용자 정보로 상태 업데이트
        setUserData({
          nickname: localStorage.getItem("nickname"),
          name: localStorage.getItem("name"),
          email: localStorage.getItem("email"),
          userType: localStorage.getItem("userType"),
        });
        setName(data.name);
        setNickname(data.nickname);
        setEmail(data.email);

        console.log("setNickname 호출 후 상태:", nickname);
      })
      .catch((error) => {
        console.error("사용자 정보를 가져오는 데 실패했습니다:", error);
      });
    }
  }, []);

  // 이메일 유효성 검사 함수
  const validateEmail = () => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setIsEmailValid(regex.test(email)); // 유효성 검사 결과를 상태로 업데이트
  };

  // 닉네임 중복 확인
  const checkNicknameDuplicate = async () => {
    if (!nickname) {
      alert('닉네임을 입력해주세요!');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/users/check-nickname?nickname=${nickname}`);
      console.log("닉네임 중복확인 응답:", response.data);  // true or false
  
      if (response.data) {
        // true = 중복됨
        setIsNicknameValid(false);
        alert(`"${nickname}" ❌ 닉네임은 이미 사용 중이에요!`);
      } else {
        setIsNicknameValid(true);
        alert(`"${nickname}" ✅ 닉네임은 사용 가능합니다!`);
      }
    } catch (error) {
      console.error('중복 확인 오류:', error);
      alert('닉네임 중복 확인에 실패했어요!❌ 잠시 후 다시 이용해주세요.');
    } finally {
      setIsLoading(false);
    }
  };


  // 수정된 회원 정보 서버에 전송
  const handleSubmit = () => {
    if (isEmailValid === false) {
      alert("올바른 이메일을 입력해주세요.");
      return;
    }

    const token = localStorage.getItem("token"); // JWT 토큰 가져오기
    const updatedUserData = { name, nickname, email };

    console.log("수정된 데이터:", updatedUserData); // 수정된 데이터 확인

    fetch("http://localhost:8080/api/user/update", {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUserData), // 수정된 정보 보내기
    })
      .then((response) => response.json())
      .then((data) => {
        alert("회원 정보가 수정되었습니다.");

      console.log("회원정보 업데이트 호출됨:", {
        name,
        nickname,
        email,
      });

        // 닉네임과 이메일을 최신 상태로 업데이트
        setName(data.name);
        setNickname(data.nickname); // 서버에서 변경된 닉네임 반영
        setEmail(data.email);
      
        // 로컬스토리지에 새로운 값 저장
        localStorage.setItem("name", data.name);
        localStorage.setItem("nickname", data.nickname); // 업데이트된 닉네임 저장
        localStorage.setItem("email", data.email);

        console.log("저장된 닉네임:", localStorage.getItem("nickname"));

        // 부모 컴포넌트의 userInfo 업데이트
        updateUserInfo({
          name,
          nickname,
          email,
        });


        window.location.href = "/mypage";
      })
      .catch((error) => {
        console.error("회원 정보 수정 실패:", error);
        alert("회원 정보 수정에 실패했습니다.");
      });
  };

  
  
  const handleCancel = () => {
    const confirmCancel = window.confirm("입력하신 내용이 초기화됩니다. 정말 취소하시겠습니까?");
    if (confirmCancel) {
      window.location.href = "/mypage";  // 이동하고 싶은 경로로 변경 가능
    }
  };
  
  

  return (
    <div className="register-edit-wrapper">
      <h2>내 정보 수정</h2>
      <form className="register-edit-form" onSubmit={(e) => e.preventDefault()}>
        {/* 아이디 (고정) */}
        <label className="register-edit-form-label">아이디</label>
        <input className="register-edit-form-input" type="text" value={localStorage.getItem("userid")} disabled />

        {/* 이름 */}
        <label className="register-edit-form-label">이름</label>
        <input className="register-edit-form-input" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="실명을 입력해주세요" />

        {/* 회원 */}
        <label className="register-edit-form-label">회원</label>
        <div>
          <input className="register-edit-form-input" type="text" value={userData.userType === "1" ? "카페회원" : "일반회원"} disabled />
          <p className="register-edit-grade-p">*회원 등급 변경은 고객센터에 문의해주세요</p>
        </div>



        {/* 닉네임 */}
        <label className="register-edit-form-label">닉네임</label>
        <div className="register-edit-form-nickname">
          <input
            className="register-edit-form-input"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임을 입력해주세요"
          />
          <button type="button" className="register-edit-nickname-btn" onClick={checkNicknameDuplicate} disabled={isLoading}>
            {isLoading ? "확인 중..." : "중복확인"}
          </button>
        </div>
        {/* 닉네임 중복확인 결과 */}
        {isNicknameValid === false && (
          <p className="signup-error-text">❌ 이미 사용 중인 닉네임입니다.</p>
        )}
        {isNicknameValid === true && (
          <p className="signup-success-text">✅ 사용 가능한 닉네임입니다.</p>
        )}


        {/* 이메일 */}
        <label className="register-edit-form-label">이메일</label>
        <input
          className="register-edit-form-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // 이메일 상태 업데이트
          onBlur={validateEmail} // 이메일 입력 후 유효성 검사
          placeholder="이메일을 입력해주세요"
          required
        />
        {isEmailValid === false && (
          <p className="signup-error-text">❌ 올바른 이메일 형식을 입력해주세요.</p>
        )}
        {isEmailValid === true && (
          <p className="signup-success-text">✅ 사용 가능한 이메일입니다.</p>
        )}

        {/* 버튼 */}
        <div className="register-edit-button-group">
          <button type="button" className="register-edit-button-group-edit" onClick={handleSubmit}>수정</button>
          <button type="button" className="register-edit-button-group-cancel" onClick={handleCancel}>취소</button>
        </div>
      </form>
    </div>
  );
};

export default RegisterChange;


