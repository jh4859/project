import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import PasswordChange from "./PassWordChange";
import RegisterChange from "./RegisterChange";
import RegisterCheck from "./RegisterCheck";
import MyCafeInfo from "./MyCafeInfo";
import MyCommunitys from "./MyCommunitys ";
import CustomerCenter from "./CustomerCenter";

const MyPage = () => {
  const [imageSrc, setImageSrc] = useState("/default_profile.png");
  const [activeSection, setActiveSection] = useState("profile");
  const [isOpenDrop, setIsOpenDrop] = useState(null);
  const [cafes, setCafes] = useState([]);
  const [waitingCount, setWaitingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);

  const [realPassword] = useState("12344");
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  const userId = localStorage.getItem("userid");
  const token = localStorage.getItem("token");
  const nickname = localStorage.getItem("nickname");

  const [userInfo, setUserInfo] = useState({
    nickname: "",
    name: "",
    email: "",
    userType: null
  });

  const [myPosts, setMyPosts] = useState([]);
  const [myComments, setMyComments] = useState([]);

  useEffect(() => {
    const storedNickname = localStorage.getItem("nickname");
    const storedName = localStorage.getItem("name");
    const storedEmail = localStorage.getItem("email");
    const storedUserType = localStorage.getItem("userType");

    setUserInfo({
      nickname: storedNickname,
      name: storedName,
      email: storedEmail,
      userType: storedUserType,
    });
  }, []);

  const updateUserInfo = (updatedUserInfo) => {
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      ...updatedUserInfo,
    }));

    localStorage.setItem("name", updatedUserInfo.name);
    localStorage.setItem("nickname", updatedUserInfo.nickname);
    localStorage.setItem("email", updatedUserInfo.email);
  };

  const toggleSection = (section) => {
    setActiveSection(section);
    if (section === "change-member") {
      setIsPasswordVerified(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIconClick = () => {
    document.getElementById("file-input").click();
  };

  const handleAccountDelete = () => {
    if (!window.confirm("정말 탈퇴하시겠습니까?")) return;

    axios.delete("http://localhost:8080/api/my-page/delete", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      alert("탈퇴가 완료되었습니다!");
      localStorage.clear();
      window.location.href = "/";
    }).catch((error) => {
      console.error("회원 탈퇴 실패:", error);
      alert("탈퇴 중 오류가 발생했습니다.");
    });
  };

  const toggleDropdown = (menuName) => {
    setIsOpenDrop((prev) => (prev === menuName ? null : menuName));
  };

  // ✨ 카페 목록 가져오기
  useEffect(() => {
    axios.get("http://localhost:8080/api/cafes", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((response) => {
      const myCafes = response.data.filter((cafe) => cafe.name === nickname);
      setCafes(myCafes);
      setWaitingCount(myCafes.filter((c) => c.approvalStatus === "PENDING").length);
      setApprovedCount(myCafes.filter((c) => ["APPROVED", "REJECTED"].includes(c.approvalStatus)).length);
    }).catch((error) => {
      console.error("카페 목록 오류:", error);
    });
  }, [nickname]);

  // ✨ 내가 쓴 글 가져오기
useEffect(() => {
  axios.get("/api/board", {
    headers: { Authorization: `Bearer ${token}` },
  }).then((res) => {
    console.log("전체 글 데이터:", res.data);

    // 내 닉네임과 일치하는 게시글만 필터링
    const myPosts = res.data.filter(post => post.nickname === nickname);
    setMyPosts(myPosts);
  })
  .catch((err) => {
    console.error("게시글 불러오기 실패", err);
  });
}, [token, nickname]);

  // ✨ 내가 쓴 댓글 가져오기
 useEffect(() => {
  if (!nickname || !token) {
    console.log("nickname 또는 token이 없음:", nickname, token);
    return;
  }

  axios.get("/api/comments/user", {
    params: { nickname},
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => {
      console.log("내 댓글 목록:", res.data);
      setMyComments(res.data);
    })
    .catch((err) => {
      console.error("내 댓글 불러오기 실패", err);
    });
}, [nickname, token]);

  return (
    <div className="mypage-container">
      <aside className="mypage-sidebar">
        <h2 className="mypage-sidebar-title">My Page</h2>
        <ul className="mypage-sidebar-menu">
          <li>
            <a href="/profile" className="mypage-sidebar-item" onClick={(e) => { toggleSection("profile"); e.preventDefault(); toggleDropdown("profile"); }}>
              프로필
            </a>
            {isOpenDrop === "profile" && (
              <ul style={{ listStyle: "none" }}>
                <li><a href="#change-password" onClick={() => toggleSection("change-password")} className="mypage-sidebar-item-content">비밀번호 변경</a></li>
                <li><a href="#change-member" onClick={() => toggleSection("change-member")} className="mypage-sidebar-item-content">회원정보 수정</a></li>
              </ul>
            )}
          </li>
          <li>
            <a href="#" className="mypage-sidebar-item" onClick={() => { toggleSection("posts-comments"); toggleDropdown("content"); }}>
              내가 쓴 내역
            </a>
          </li>
          {userInfo.userType === "1" && (
            <li>
              <a href="#my-cafe-info" className="mypage-sidebar-item" onClick={(e) => { e.preventDefault(); toggleSection("my-cafe-info"); }}>
                카페 등록
              </a>
            </li>
          )}
          <li>
            <a href="#customer-center" className="mypage-sidebar-item" onClick={() => toggleSection("question")}>
              고객센터
            </a>
          </li>
        </ul>
        <div className="mypage-sidebar-bye-box">
          <button className="mypage-sidebar-button" onClick={handleAccountDelete}>회원 탈퇴</button>
        </div>
      </aside>

      <main className="mypage-main-content">
        {activeSection === "profile" && (
          <>
            <div className="mypage-user-info-box">
              <div className="mypage-box-profile">
                <div className="mypage-img-box-box">
                  <img className="mypage-img" src={imageSrc} alt="프로필" />
                  <div>
                    <button className="mypage-change-btn" onClick={handleIconClick}>이미지 변경</button>
                    <input type="file" id="file-input" style={{ display: "none" }} onChange={handleImageChange} />
                  </div>
                </div>
              </div>
              <div className="mypage-button-group">
                <div className="mypage-user-info-text">
                  <p className="mypage-username">{userInfo.nickname} 님</p>
                  <p>{userId}</p>
                  <p>{userInfo.name}</p>
                  <p>{userInfo.userType === "1" ? "카페회원" : userInfo.userType === "3" ? "관리자" : "일반회원"}</p>
                  <p>{userInfo.email}</p>
                </div>
                <button className="mypage-outline-button" onClick={() => { setActiveSection("change-member"); alert("회원정보 수정 페이지로 이동합니다."); }}>회원수정</button>
                <button className="mypage-outline-button" onClick={() => { setActiveSection("change-password"); alert("비밀번호변경 페이지로 이동합니다."); }}>비밀번호변경</button>
              </div>
            </div>

            <div className="mypage-application-status">
              {userInfo.userType === "1" && (
                <>
                  <div className="mypage-status-item">
                    <p className="mypage-label">승인대기</p>
                    <p className="mypage-value">{waitingCount}건</p>
                  </div>
                  <div className="mypage-status-item">
                    <p className="mypage-label">승인완료</p>
                    <p className="mypage-value">{approvedCount}건</p>
                  </div>
                </>
              )}
              <div className="mypage-status-item">
                <p className="mypage-label">내가 쓴 글</p>
                <p className="mypage-value">{myPosts.length}건</p>
              </div>
              <div className="mypage-status-item">
                <p className="mypage-label">내가 쓴 댓글</p>
                <p className="mypage-value">{myComments.length}건</p>
              </div>
            </div>
          </>
        )}

        {activeSection === "posts-comments" && <MyCommunitys />}
        {activeSection === "change-password" && <PasswordChange realPassword={realPassword} />}
        {activeSection === "my-cafe-info" && <MyCafeInfo />}
        {activeSection === "change-member" && (isPasswordVerified ? (
          <RegisterChange updateUserInfo={updateUserInfo} />
        ) : (
          <RegisterCheck realPassword={realPassword} onSuccess={() => setIsPasswordVerified(true)} />
        ))}
        {activeSection === "question" && <CustomerCenter />}
      </main>
    </div>
  );
};

export default MyPage;
