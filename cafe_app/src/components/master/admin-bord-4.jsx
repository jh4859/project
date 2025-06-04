import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Sidebar from "./sidebar";


const AdminList = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로 정보 가져오기
  const [pendingCafes, setPendingCafes] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [activePage, setActivePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수 상태
  const usersPerPage = 8; // 한 페이지에 보여줄 회원 수
  const [searchTerm, setSearchTerm] = useState("");   // 검색기능
  const [searchType, setSearchType] = useState("title"); // 기본은 제목 검색
  const [searchTriggered, setSearchTriggered] = useState(false); // 검색 버튼 눌러야 활성화


  // ✅ 관리자 인증 체크
   useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = parseInt(localStorage.getItem("userType"));
      
    if (!token || userType !== 3) {
      setIsAuthorized(false); // 상태만 설정
    } else {
      console.log("✅ 관리자 권한 확인 완료");
      setIsAuthorized(true);
        }
  }, []);



  // 승인 대기 중인 카페 목록 불러오기
  useEffect(() => {
    if (isAuthorized) {
      fetchPendingCafes(); // 카페 목록을 처음 불러옵니다.
    }
  }, [isAuthorized, activePage]);

  // 검색
  useEffect(() => {
    setSearchTriggered(false); // 검색어 바꾸면 검색 버튼 다시 눌러야 작동함
  }, [searchTerm, searchType]);

  // 서버에서 카페 목록 불러오기
  const fetchPendingCafes = () => {
    const token = localStorage.getItem("token");
    axios.get("http://localhost:8080/cafes/", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setPendingCafes(response.data); // 응답이 배열일 경우 상태 업데이트
          setTotalPages(Math.ceil(response.data.length / usersPerPage)); // 전체 페이지 수 계산
        } else {
          console.error("카페 목록은 배열이어야 합니다.");
          setPendingCafes([]); // 배열이 아니면 빈 배열로 설정
        }
      })
      .catch((error) => {
        console.error("카페 목록을 불러오는 데 실패했습니다.", error);
        setPendingCafes([]); // 실패 시 빈 배열로 설정
      });
  };
  
    // 카페 승인 처리
    const approveCafe = (cafeId) => {
      const token = localStorage.getItem("token"); // ✅ 토큰 가져오기
      axios.post(`http://localhost:8080/cafes/${cafeId}/approve`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(() => {
          alert("카페가 승인되었습니다.");
          // 서버에서 승인이 반영되었으므로 해당 카페만 클라이언트에서 업데이트
          setPendingCafes(prevCafes =>
            prevCafes.map(cafe =>
              cafe.id === cafeId ? { ...cafe, approvalStatus: 'APPROVED' } : cafe
            )
          );
        })
        .catch((error) => {
          console.error("카페 승인에 실패했습니다.", error);
          alert("카페 승인에 실패했습니다.");
        });
    };
  
    // 카페 거절 처리
    const rejectCafe = (cafeId) => {
      const token = localStorage.getItem("token"); // ✅ 토큰 가져오기
      axios.post(`http://localhost:8080/cafes/${cafeId}/reject`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(() => {
          alert("카페가 거절되었습니다.");
          
          // 서버에서 거절이 반영되었으므로 해당 카페만 클라이언트에서 업데이트
          setPendingCafes(prevCafes =>
            prevCafes.map(cafe =>
              cafe.id === cafeId ? { ...cafe, approvalStatus: 'REJECTED' } : cafe
            )
          );
        })
        .catch((error) => {
          console.error("카페 거절에 실패했습니다.", error);
          alert("카페 거절에 실패했습니다.");
        });
    };

  // 카페 삭제
  const deleteCafe = async (id) => {
    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;
  
    const token = localStorage.getItem("token");
    axios.delete(`http://localhost:8080/api/deleteCafe/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(() => {
        alert("카페가 삭제되었습니다.");
        setPendingCafes(prev => prev.filter(cafe => cafe.id !== id));
      })
      .catch((error) => {
        console.error("카페 삭제에 실패했습니다.", error);
        alert("카페 삭제에 실패했습니다.");
      });
  };

  // 카페 반려
  const toggleCafeApproval = (cafeId, currentStatus) => {
    const token = localStorage.getItem("token");
  
    if (currentStatus === 'APPROVED') {
      // 승인된 카페에서 반려 버튼을 눌렀을 때 확인을 띄운다
      const confirmReject = window.confirm("카페 등록을 거절하시겠습니까?");
      if (!confirmReject) return; // 사용자가 취소하면 아무 작업도 하지 않음
  
      // 반려 처리
      const url = `http://localhost:8080/cafes/${cafeId}/reject`;
  
      axios.post(url, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(() => {
        alert("카페 상태가 거절로 변경되었습니다.");
        // 상태 업데이트
        setPendingCafes(prevCafes =>
          prevCafes.map(cafe =>
            cafe.id === cafeId
              ? { ...cafe, approvalStatus: 'REJECTED' }  // 거절로 상태 변경
              : cafe
          )
        );
      })
      .catch((error) => {
        console.error("상태 변경 실패", error);
        alert("카페 상태 변경에 실패했습니다.");
      });
    }
  
    if (currentStatus === 'REJECTED') {
      // 거절된 카페에서 승인 버튼을 눌렀을 때 확인을 띄운다
      const confirmApprove = window.confirm("카페 등록을 승인하시겠습니까?");
      if (!confirmApprove) return; // 사용자가 취소하면 아무 작업도 하지 않음
  
      // 승인 처리
      const url = `http://localhost:8080/cafes/${cafeId}/approve`;
  
      axios.post(url, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(() => {
        alert("카페 상태가 승인으로 변경되었습니다.");
        // 상태 업데이트
        setPendingCafes(prevCafes =>
          prevCafes.map(cafe =>
            cafe.id === cafeId
              ? { ...cafe, approvalStatus: 'APPROVED' }  // 승인으로 상태 변경
              : cafe
          )
        );
      })
      .catch((error) => {
        console.error("상태 변경 실패", error);
        alert("카페 상태 변경에 실패했습니다.");
      });
    }
  };
  
  
  
  // 미리보기
  const handleView = (id) => {
    window.open(`/cafedetail/${id}`, "_blank");
  };

  const handlePageClick = (page) => {
    setActivePage(page);
  };

  const renderRows = () => {
    let filteredCafes = pendingCafes;

    if (searchTriggered && searchTerm.trim() !== "") {
      filteredCafes = pendingCafes.filter((cafe) => {
        const valueToSearch = searchType === "title" ? cafe.title : cafe.name;
        return valueToSearch.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // 카페를 최신순(내림차순)으로 정렬
    const sortedCafes = [...filteredCafes].sort((a, b) => new Date(b.regDate) - new Date(a.regDate));

    const indexOfLastCafe = activePage * usersPerPage;
    const indexOfFirstCafe = indexOfLastCafe - usersPerPage;
    const currentCafes = sortedCafes.slice(indexOfFirstCafe, indexOfLastCafe);

    console.log("✅ 정렬 후:", sortedCafes.map(c => `${c.title} - ${c.regDate}`));    

    // 카페가 없을 때 메시지 출력
    if (filteredCafes.length === 0) {
      return (
        <tr>
          <td colSpan="8" className="cafelist-empty-message">
            등록된 카페가 없습니다.
          </td>
        </tr>
      );
    }

    return currentCafes.map((cafe, index) => (
      <tr key={cafe.id}>
        <td>{pendingCafes.length - (index + (activePage - 1) * usersPerPage)}</td>
        <td>{cafe.title}</td>
        <td>{cafe.name}</td>
        <td>
          {new Date(cafe.regDate).getFullYear()}-
          {('0' + (new Date(cafe.regDate).getMonth() + 1)).slice(-2)}-
          {('0' + new Date(cafe.regDate).getDate()).slice(-2)}
        </td>
        <td>
          {cafe.approvalStatus === 'APPROVED' && cafe.approvalAt 
            ? `${new Date(cafe.approvalAt).getFullYear()}-${('0' + (new Date(cafe.approvalAt).getMonth() + 1)).slice(-2)}-${('0' + new Date(cafe.approvalAt).getDate()).slice(-2)}`
            : '-'}
        </td>
        <td>
        <button className="board4-view-btn" onClick={() => handleView(cafe.id)}>미리보기</button>
        </td>
        <td>
          <span className={
            cafe.approvalStatus === 'PENDING' ? 'status-pending' :
            cafe.approvalStatus === 'APPROVED' ? 'status-approved' :
            cafe.approvalStatus === 'REJECTED' ? 'status-rejected' :
            ''
          }>
            {cafe.approvalStatus === 'PENDING' ? '대기' :
            cafe.approvalStatus === 'APPROVED' ? '승인' :
            cafe.approvalStatus === 'REJECTED' ? '거절' :
            ''}
          </span>
        </td>
        <td>
          {cafe.approvalStatus === 'PENDING' && (
            <>
              <button className="board4-approve-btn" onClick={() => approveCafe(cafe.id)}>승인</button>{" "}
              <button className="board4-reject-btn" onClick={() => rejectCafe(cafe.id)}>거절</button>
            </>
          )}
            {cafe.approvalStatus === 'APPROVED' && (
            <>
              <button className="board4-return-btn" onClick={() => toggleCafeApproval(cafe.id, cafe.approvalStatus)}>반려</button>{" "}
              <button className="board4-delete-btn" onClick={() => deleteCafe(cafe.id)}>삭제</button>
            </>
          )}
          {cafe.approvalStatus === 'REJECTED' && (
            <>
              <button className="board4-return-btn" onClick={() => toggleCafeApproval(cafe.id, cafe.approvalStatus)}>반려</button>{" "}
              <button className="board4-delete-btn" onClick={() => deleteCafe(cafe.id)}>삭제</button>
            </>
          )}
        </td>
      </tr>
    ));
  };

  return (
    <div className="admin-board">
        {/* 사이드바 */}
        <div className="sidebar-allbox-main">
          <Sidebar />
        </div>

    {/* 메인 컨텐츠 */}
    <div className="mainlist-content">
        <h1 className="adminboard4-h1">카페연구소 카페등록 목록</h1>

        <div className="admin-4-search-container">
          <select className="admin-4-search-select" value={searchType}  onChange={(e) => setSearchType(e.target.value)}>
            <option value="title">카페 이름</option>
            <option value="name">작성자</option>
          </select>
          <input type="text" className="admin-4-search-input" placeholder="검색어를 입력하세요" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
          <button className="admin-4-search-btn" onClick={() => {setSearchTriggered(true); setActivePage(1);}}>
            검색
          </button>
        </div>

        <table className="admin-listboard-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>카페이름</th>
              <th>작성자</th>
              <th>신청일자</th>
              <th>승인일자</th>
              <th>미리보기</th>
              <th>상태</th>
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
