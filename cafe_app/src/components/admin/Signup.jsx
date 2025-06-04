import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";


const Signup = () => {
  const navigate = useNavigate();
  const [userid, setUserid] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('0');
  const [postalCode, setPostalCode] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isUseridValid, setIsUseridValid] = useState(null); // null | true | false //아이디 영어와 숫자만 가능하게하는상태
  const [isPasswordValid, setIsPasswordValid] = useState(null); //비밀번호 입력시 조건필요한 부분
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(null); //비밀번호 중복확인상태
  const [isEmailValid, setIsEmailValid] = useState(null); // 이메일 유효성 상태 추가
  const [isUsernameValid, setIsUsernameValid] = useState(null); // 이메일 유효성 상태 추가
  const [isNicknameValid, setIsNicknameValid] = useState(null); // 닉네임 유효성 상태 추가
  const [isLoading, setIsLoading] = useState(false); //비동기처리
  const [isUseridDuplicate, setIsUseridDuplicate] = useState(null); // 아이디 중복 여부


  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      userid === '' ||
      username === '' ||
      email === '' ||
      password === '' ||
      confirmPassword === '' ||
      nickname === '' ||
      !userType ||
      (userType === '1' && (postalCode === '' || address === '' || detailAddress === '')) ||
      (userType === '1' && detailAddress === '')
    ) {
      setErrorMessage('모든 항목을 정확히 입력해주세요.');
      return;
    }
  
    if (password !== confirmPassword) {
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }
  
    // API 요청 데이터
    const userData = {
      userid,
      username,
      email,
      password,
      nickname,
      userType: parseInt(userType),
      postalCode,
      address,
      detailAddress,
    };
    console.log("보낼 데이터: ", userData);
    try {
      const response = await axios.post('http://localhost:8080/api/users/signup', userData, {
        headers: { 'Content-Type': 'application/json' }
      });
  
      alert(response.data); // "회원가입 성공!" 메시지
      navigate('/login'); //로그인 페이지로 이동
    }
     catch (error) {
      console.error('회원가입 실패:', error);
      setErrorMessage('회원가입에 실패했습니다.');
    }
  };

  const handlePostcodeSearch = () => {
    if (!window.daum || !window.daum.Postcode) {
      alert('주소 API가 아직 로드되지 않았어요. 잠시 후 다시 시도해주세요.');
      return;
    }
    new window.daum.Postcode({
      oncomplete: function (data) {
        setPostalCode(data.zonecode);
        setAddress(data.address);
        setDetailAddress('');
      },
    }).open();
  };

    //아이디 관련 내용
  const validateUserid = () => {
    const regex = /^[a-zA-Z0-9]+$/; // 영어+숫자만
    if (userid === '') {
      setIsUseridValid(null);
    } else {
      setIsUseridValid(regex.test(userid));
    }
  };
    //아이디 중복 관련 내용
    const checkUseridDuplicate = async () => {
      if (!userid) {
        alert('아이디를 입력해주세요!');
        return;
      }
      setIsLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/api/users/check-userid?userid=${userid}`);
        if (response.data) {
          alert(`"${userid}" 이미 사용 중인 아이디입니다!`);
          setIsUseridDuplicate(true); // 중복 아이디일 경우
        } else {
          alert(`"${userid}"  사용 가능한 아이디입니다!`);
          setIsUseridDuplicate(false); // 사용 가능한 아이디일 경우
        }
      } catch (error) {
        console.error('아이디 중복 확인 오류:', error);
        alert('아이디 중복 확인에 실패했습니다! 잠시 후 다시 이용해주세요.');
      } finally {
        setIsLoading(false);
      }
    };

    //비밀번호 관련 내용
  const validatePassword = () => {
    // 정규식: 최소 8자, 영어/숫자 포함
    const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*])[A-Za-z\d~!@#$%^&*]{8,}$/;
    setIsPasswordValid(regex.test(password)); // 유효성 검사 결과를 상태로 업데이트
  };

    //비밀번호 확인 관련내용
  const validateConfirmPassword = () => {
    if (confirmPassword !== password) {
      setIsConfirmPasswordValid(false);
    } else {
      setIsConfirmPasswordValid(true);
    }
  };

    //이메일관련내용
  const validateEmail = () => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setIsEmailValid(regex.test(email));
  };

    //이름관련내용
  const validateUsername = () => {
    const regex = /^[a-zA-Z가-힣]+$/; // 영문자와 한글만 허용
    if (username === '') {
      setIsUsernameValid(null);
    } else {
      setIsUsernameValid(regex.test(username));
    }
  };

    //닉네임관련내용
const checkNicknameDuplicate = async () => {
  if (!nickname) {
    alert('닉네임을 입력해주세요!');
    return;
  }

  setIsLoading(true); // 로딩 시작

  try {
    const response = await axios.get(`http://localhost:8080/api/users/check-nickname?nickname=${nickname}`);

    const isDuplicate = response.data; // 응답은 Boolean 값 (true 또는 false)

    if (isDuplicate) {
      alert(`"${nickname}" 이미 사용 중입니다!`);
      setIsNicknameValid(false); // ❌ 중복이면 false
    } else {
      alert(`"${nickname}" 사용 가능합니다!`);
      setIsNicknameValid(true); // ✅ 중복 아니면 true
    }
  } catch (error) {
    console.error('중복 확인 오류:', error);
    alert('닉네임 중복 확인에 실패했습니다! 잠시 후 다시 이용해주세요.');
  } finally {
    setIsLoading(false); // 로딩 종료
  }
};

  return (
    <div className="signup-total-box">
      <div className="showdow-box">
        <div className="signup-img-box">
          <div className="signup-img-left">
            <img src="/registerchar.png" alt="환영사진" />
          </div>
        </div>
        <div className="signup-container">
        <h2 className='signup-h2'>회원가입</h2>
        <form onSubmit={handleSubmit}>
        <div className="dubleck-box">
          <input className='signup-userid' type="text" value={userid} onChange={(e) => setUserid(e.target.value)} onBlur={validateUserid} placeholder="아이디" required  autoComplete="off"/>
          <button className='dck-btn' type="button" onClick={checkUseridDuplicate} disabled={isLoading}>{isLoading ? '확인 중...' : '중복 확인'}</button>
        </div>
        {isUseridValid === false && (<p className="signup-error-text"> 아이디를 다시 입력해주세요.</p>)}
         {isUseridValid === true && isUseridDuplicate === true && (<p className="signup-error-text"> 아이디가 이미 사용 중입니다.</p>)}
        {isUseridValid === true && isUseridDuplicate === false && (<p className="signup-success-text"> 사용 가능한 아이디입니다.</p>)}
          <input className='signup-pwd' type="password" value={password} onChange={
            (e) =>  {const newPassword = e.target.value;
              setPassword(newPassword);
              setIsPasswordValid(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*])[A-Za-z\d~!@#$%^&*]{8,}$/.test(newPassword)); // 즉시 검증
            }} onBlur={validatePassword} placeholder="비밀번호" required autoComplete="new-password"/>
          {isPasswordValid === false && (<p className="signup-error-text"> 8자 이상, 영문자와 숫자, 특수기호(~,!,@,# 등)를 포함해주세요.</p>)}
          {isPasswordValid === true && (<p className="signup-success-text"> 사용 가능한 비밀번호입니다.</p>)}

          <input className='signup-pwd-ck' type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} onBlur={validateConfirmPassword} placeholder="비밀번호 확인" required autoComplete="new-password"/>
          {isConfirmPasswordValid === false && (<p className="signup-error-text"> 비밀번호가 일치하지 않습니다.</p>)}
          {isConfirmPasswordValid === true && (<p className="signup-success-text"> 비밀번호가 일치합니다.</p>)}

          <input className='signup-email' type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={validateEmail} placeholder="이메일" required />
          {isEmailValid === false && (<p className="signup-error-text"> 올바른 이메일 형식을 입력해주세요.</p>)}
          {isEmailValid === true && (<p className="signup-success-text"> 사용 가능한 이메일 형식입니다.</p>)}
          <input className='signup-username' type="text" value={username} onChange={(e) => setUsername(e.target.value)} onBlur={validateUsername} placeholder="이름" required/>
          {isUsernameValid === false && (<p className="signup-error-text">이름에 숫자나 특수기호를 사용할 수 없습니다.</p>)}
          {isUsernameValid === true && (<p className="signup-success-text"> 유효한 이름입니다.</p>)}
          <div className="dubleck-box">
            <input className="signup-niname" type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="닉네임" /> {/* 값업데이트 */}
            <button className='dck-btn' type="button" onClick={checkNicknameDuplicate} disabled={isLoading} >{isLoading ? '확인 중...' : '중복 확인'}</button>  {/* 중복 확인 버튼 */}
          </div>
          {isNicknameValid === true && (<p className="signup-success-text"> 사용 가능한 닉네임입니다.</p>)}
          {isNicknameValid === false && (<p className="signup-error-text"> 닉네임이 이미 사용 중입니다.</p>)}

          <div className="signup-user-type">
            <label className='signup-radio-n'>
              <input className='signup-radio-n' type="radio" name="userType" value="0" checked={userType === "0"} onChange={handleUserTypeChange} required />
              일반회원
              </label>
            <label className='signup-radio-c'>
              <input className='signup-radio-c' type="radio" name="userType" value="1" checked={userType === '1'} onChange={handleUserTypeChange} required />
              카페점주
            </label> 
          </div>
          {userType === '1' && (
            <div className="address-container">
              <input className="postalCode" type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="우편번호" readOnly />
              <button className='adr-btn' type="button" onClick={handlePostcodeSearch}> 우편번호 찾기 </button>
            </div>
          )}

          {userType === '1' && (
            <>
              <input className="signup-address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="주소" readOnly />
              <input className='signup-adr-p' type="text" value={detailAddress} onChange={(e) => setDetailAddress(e.target.value)} placeholder="상세주소" required />
            </>
          )}

          <input className='sigh-submit' type="submit" value="회원가입" />
          {errorMessage && <div className="sigh-error">{errorMessage}</div>}
        </form>
        <div className="sigh-footer">
          <a href="/login" id="login-link">로그인</a> |
          <a href="/" id="terms-link">메인으로</a>
        </div>
      </div>
      </div>
    </div>
    
  );
};

export default Signup;