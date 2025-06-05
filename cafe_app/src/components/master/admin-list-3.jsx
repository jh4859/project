import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./sidebar";

const AdminList = () => {
  const [searchTerm, setSearchTerm] = useState("");   // 검색기능
  const [searchType, setSearchType] = useState("userid"); // 기본은 제목 검색
  const [searchTriggered, setSearchTriggered] = useState(false); // 검색 버튼 눌러야 활성화

  const [users, setUsers] = useState([]); // ← 서버에서 받아올 회원 데이터;
  const [isAuthorized, setIsAuthorized] = useState(null); // ← 이거 추가!!
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수 상태
  const usersPerPage = 8; // 한 페이지에 보여줄 회원 수
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUserType, setEditedUserType] = useState(null);

   // 관리자가 맞는지 확인하는 useEffect
     useEffect(() => {
       const token = localStorage.getItem("token");
       const userType = parseInt(localStorage.getItem("userType"));
   
       if (!token || userType !== 3) {
         setIsAuthorized(false);  // ❗관리자가 아님
       } else {
         setIsAuthorized(true);  // ✅관리자 맞음
       }
     }, []); // 컴포넌트 처음 렌더링 시 한 번만 실행
   
     // 권한 없으면 로그인 페이지로 이동하는 useEffect
     useEffect(() => {
       if (isAuthorized === false) {
         if (window.confirm("잘못된 경로입니다. 메인 페이지로 이동합니다.")) {
           navigate("/");  // 메인 페이지로 리디렉션
         }
       }
     }, [isAuthorized, navigate]); // isAuthorized가 false일 때만 실행
   
  useEffect(() => {
    axios.get("http://localhost:8080/api/users?userType=3")
      .then((response) => {
        console.log("관리자들:", response.data); // 콘솔에 출력
        setUsers(response.data); // 회원 리스트 저장
        // 전체 회원 수로 총 페이지 수 계산
        const totalUsers = response.data.length;
        const totalPagesCalculated = Math.ceil(totalUsers / usersPerPage); // 전체 페이지 수 계산
        setTotalPages(totalPagesCalculated); // 총 페이지 수 상태 업데이트
      })
      .catch((error) => {
        console.error("관리자 데이터를 불러오지 못했습니다.", error);
        alert("관리자 데이터를 불러오지 못했습니다."); // 오류 메시지 표시
      });
  }, []);

    // 검색
    useEffect(() => {
      setSearchTriggered(false); // 검색어 바꾸면 검색 버튼 다시 눌러야 작동함
    }, [searchTerm, searchType]);


  // 수정 또는 저장 핸들러
  const handleEditClick = (item) => {
    if (editingUserId === item.userid) {
      // 저장 버튼 클릭 시
      axios
        .put(`http://localhost:8080/api/users/${item.userid}`, {
          ...item,
          userType: editedUserType,
        })
        .then((response) => {
          alert("수정되었습니다.");
  
          // 👉 userType이 바뀌었으면 그에 맞는 목록으로 이동
          setEditingUserId(null);
          setEditedUserType(null);
  
          // 필터링된 userType으로 다시 호출 (예: 0은 일반회원, 1은 카페사장)
          axios
            .get(`http://localhost:8080/api/users?userType=${editedUserType}`)
            .then((res) => {
              setUsers(res.data);
  
              // 페이지 관련 값도 다시 계산
              const totalUsers = res.data.length;
              const totalPagesCalculated = Math.ceil(totalUsers / usersPerPage);
              setTotalPages(totalPagesCalculated);
              setActivePage(1); // 첫 페이지로 이동
            });
        })
        .catch((error) => {
          console.error("수정 실패", error);
          alert("수정 중 오류가 발생했습니다.");
        });
    } else {
      // 수정 버튼 클릭 시
      setEditingUserId(item.userid);
      setEditedUserType(item.userType);
    }
  };

    // ✨ 삭제 핸들러 추가
    const handleDelete = (userid) => {
      const confirmDelete = window.confirm("정말 탈퇴시키시겠습니까?");
      if (confirmDelete) {
        axios.delete(`http://localhost:8080/api/users/${userid}`)
          .then(() => {
            alert("탈퇴 처리되었습니다.");
            // 탈퇴 후 회원 목록에서 해당 회원을 제거
            const updatedUsers = users.filter((user) => user.userid !== userid);
            setUsers(updatedUsers);
    
            // 새로운 전체 페이지 수 계산
            const totalUsers = updatedUsers.length;
            const totalPagesCalculated = Math.ceil(totalUsers / usersPerPage);
            setTotalPages(totalPagesCalculated);
    
            // 현재 페이지가 총 페이지 수보다 클 경우, 마지막 페이지로 이동
            if (activePage > totalPagesCalculated) {
              setActivePage(totalPagesCalculated); // 마지막 페이지로 설정
            }
          })
          .catch((error) => {
            console.error("삭제 실패", error);
            alert("삭제 중 오류가 발생했습니다.");
          });
      }
    };

    const handlePageClick = (page) => {
      if (page >= 1 && page <= totalPages) {
        setActivePage(page);
      }
    };

    // 관리자 아닌 경우 아무것도 렌더링하지 않음
    if (isAuthorized === null || isAuthorized === false) {
      return null;
    }
  
  
  const renderRows = () => {
    let filteredUsers  = users;

      // 검색 필터링 적용
      if (searchTriggered && searchTerm.trim() !== "") {
        filteredUsers = users.filter((user) => {
          const valueToSearch = searchType === "userid" ? user.userid : user.nickname;
          return valueToSearch.toLowerCase().includes(searchTerm.toLowerCase());
        });
      }

      filteredUsers = filteredUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // 페이징 적용
      const indexOfLastUser = activePage * usersPerPage;
      const indexOfFirstUser = indexOfLastUser - usersPerPage;
      const usersOnCurrentPage = filteredUsers.slice(indexOfFirstUser, indexOfLastUser); // 필터된 배열에서 페이징 적용


      // 회원이 없을 경우 메시지 표시
      if (filteredUsers.length === 0) {
        return (
          <tr>
            <td colSpan="8" className="admin-empty-message">
              가입한 회원이 없습니다.
            </td>
          </tr>
        );
      }


    return usersOnCurrentPage.map((item, index) => (
      <tr key={item.userid}>
        <td>{filteredUsers.length - ((activePage - 1) * usersPerPage + index)}</td>
        <td>{item.userid}</td>
        <td>{item.username}</td>
        <td>{item.email}</td>
        <td>{item.nickname}</td>
        <td>
          {editingUserId === item.userid ? (
            <select value={editedUserType} onChange={(e) => setEditedUserType(parseInt(e.target.value))}>
              <option value={0}>일반회원</option>
              <option value={1}>카페점주</option>
              <option value={3}>관리자</option>
            </select>
            ) :( item.userType === 0 ? ( "일반회원") : item.userType === 1 ? ("카페점주") : 
             item.userType === 3 ? "관리자" : "알 수 없음"  )} 
        </td>
        <td> {new Date(item.createdAt).getFullYear()}-
             {('0' + (new Date(item.createdAt).getMonth() + 1)).slice(-2)}-
             {('0' + new Date(item.createdAt).getDate()).slice(-2)}
        </td>
        <td>
          <button className="list-rem-btn" onClick={() => handleEditClick(item)} >
            {editingUserId === item.userid ? "저장" : "변경"}
            </button>{" "}
          <button className="list-delete-btn" onClick={() => handleDelete(item.userid)} >탈퇴</button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="admin-board">

     <div className="sidebar-allbox-main">
      <Sidebar />
     </div>
      {/* 메인 컨텐츠 */}
      <div className="mainlist-content">
        <h1 className="adminlist-h1">카페연구소 관리자 목록</h1>

        <div className="admin-search-write-row">
          <div className="admin-4-search-container">
            <select className="admin-4-search-select" value={searchType}  onChange={(e) => setSearchType(e.target.value)}>
              <option value="userid">아이디</option>
              <option value="nickname">닉네임</option>
            </select>
            <input type="text" className="admin-4-search-input" placeholder="검색어를 입력하세요" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
            <button className="admin-4-search-btn" onClick={() => {setSearchTriggered(true); setActivePage(1);}}>
              검색
            </button>
          </div>
        </div>

        <table className="admin-listboard-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>아이디</th>
              <th>이름</th>
              <th>이메일</th>
              <th>닉네임</th>
              <th>회원분류</th>
              <th>가입일자</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody>{renderRows()}</tbody>
        </table>

        <div className="pagination">
          <button className="pagination-btn_prev-btn"   disabled={activePage === 1} onClick={() => handlePageClick(activePage - 1)} ><i class="fas fa-angle-left"></i>  </button>
          {/* 페이지 숫자 처리 */}
            {totalPages > 0 ? (
              [...Array(totalPages)].map((_, index) => (
                <span
                  key={index}
                  className={activePage === index + 1 ? "active" : ""}
                  onClick={() => handlePageClick(index + 1)}
                >
                  {index + 1}
                </span>
              ))
            ) : (
              <span className="active">1</span> // 게시글이 없을 때 페이지는 기본적으로 1로 표시
            )}
          <button className="pagination-btn_next-btn" disabled={activePage === totalPages} onClick={() => handlePageClick(activePage + 1)}><i class="fas fa-angle-right"></i></button>
        </div>

      </div>
    </div>
  );
};

export default AdminList;
