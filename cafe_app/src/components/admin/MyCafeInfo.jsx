import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import "../../style/admin/MyCafeInfo.css"; 
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { CafeContext } from "../CafeProvider";


const MyCafeInfo = () => {
  const [myCafes, setMyCafes] = useState([]);  // 로그인한 사용자 닉네임에 맞는 카페 목록
  const [loading, setLoading] = useState(true);
  const { deleteCafe } = useContext(CafeContext);
  const nickname = localStorage.getItem('nickname');  // 로컬 스토리지에서 닉네임 가져오기

  const navigate = useNavigate();

  // 카페 목록 불러오기
  useEffect(() => {
    if (!nickname) return;  // 닉네임이 없으면 실행하지 않음

    axios.get('http://localhost:8080/api/cafes') // 카페 목록을 가져오는 API
      .then(response => {
        const cafeList = response.data;
        console.log("🚀 가져온 카페 목록:", cafeList);

        // 로그인한 사람의 닉네임에 맞는 카페만 필터링
        const filteredCafes = cafeList.filter(cafe => cafe.name === nickname);
        console.log("내 카페 목록:", filteredCafes);

        setMyCafes(filteredCafes);  // 내 카페 목록 저장
        setLoading(false);  // 로딩 완료
      })
      .catch(error => {
        console.error("카페 목록 불러오기 실패", error);
        setLoading(false);  // 로딩 완료 (실패 처리)
      });
  }, [nickname]);  // 닉네임이 바뀔 때마다 다시 실행

  // 수정
  const handleEdit = (id) => {
    navigate(`/cafeedit/${id}`);  // cafe.id를 들고 CafeUpload로 이동
  };

  // 삭제
  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
      
    try {
      await axios.delete(`http://localhost:8080/api/deleteCafe/${id}`);
      deleteCafe(id); // context에서 상태 제거
      alert("삭제되었습니다.");
      navigate("/mypage");
      window.location.reload(); // 페이지 새로고침
    } catch (error) {
      console.error("삭제 실패", error);
      alert("삭제에 실패했습니다.");
    }
  };

  // 미리보기
  const handleView = (id) => {
    const url = `/cafedetail/${id}`;  // 새 창에서 열 카페 상세 페이지 URL
    window.open(url, '_blank');  // 새 창으로 URL 열기
  };

  // const handleCancel = (id) => {
  //   console.log('보기 클릭 - 카페 ID:', id);
  // };


  const renderTable = (title, data, type) => (
    <div className="mycafe-table-section">
      <h2 className='mycafe-table-section-h2'>{title}</h2>
      <table className="mycafe-table">
        <thead>
          <tr className='mycafe-table-tr'>
            <th className='mycafe-table-th'>번호</th>
            <th className='mycafe-table-th'>카페명</th>
            <th className='mycafe-table-th'>제목</th>
            {type === 'waiting' && <th className='mycafe-table-th'>신청일</th>}
            {type === 'approved' && <th className='mycafe-table-th'>승인일</th>}
            <th className='mycafe-table-th'>상태</th>
            <th className='mycafe-table-th'>비고</th>
          </tr>
        </thead>
        <tbody>
          {/* 카페 목록이 비었을 경우 메시지 출력 */}
          {data.length === 0 ? (
            <tr>
              <td colSpan="6" className='mycafe-empty-message'>해당 카페가 없습니다.</td>
            </tr>
          ) : (
            data.map((cafe, index) => (
              <tr key={cafe.id}>
                <td className='mycafe-table-td'>{index + 1}</td>
                <td className='mycafe-table-td'>{cafe.name}</td>
                <td className='mycafe-table-td'>{cafe.title}</td>
                <td className='mycafe-table-td-date'>{type === 'waiting' ? 
                  new Date(cafe.regDate).getFullYear() + '-' + 
                  ('0' + (new Date(cafe.regDate).getMonth() + 1)).slice(-2) + '-' + 
                  ('0' + new Date(cafe.regDate).getDate()).slice(-2)
                  :
                  new Date(cafe.approvalAt).getFullYear() + '-' + 
                  ('0' + (new Date(cafe.approvalAt).getMonth() + 1)).slice(-2) + '-' + 
                  ('0' + new Date(cafe.approvalAt).getDate()).slice(-2)
                  }
                </td>
                <td className='mycafe-table-td'>
                    {cafe.approvalStatus === 'PENDING' ? '승인 대기' :
                    cafe.approvalStatus === 'APPROVED' ? '승인 완료' :
                    cafe.approvalStatus === 'REJECTED' ? '승인 거절' : '알 수 없음'}
                </td>
                <td className='mycafe-table-td'>
                  {cafe.approvalStatus !== 'REJECTED' && (
                    <div className='mycafe-table-td-btns'>
                      {type === 'waiting' ? (
                      <>
                      <button className='mycafe-table-td-showbtn' onClick={() => handleView(cafe.id)}>미리보기</button>
                      </> 
                      ) : (
                      <>
                      <button className='mycafe-table-td-editbtn' onClick={() => handleEdit(cafe.id)}>수정</button>
                      <button className='mycafe-table-td-deletebtn' onClick={() => handleDelete(cafe.id)}>삭제</button>
                      </>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  // 승인 대기 카페와 승인 완료 카페 필터링
  const waitingList = myCafes.filter(c => c.approvalStatus === 'PENDING');
  const approvedList = myCafes.filter(c => c.approvalStatus === 'APPROVED' || c.approvalStatus === 'REJECTED');  

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <div className="cafe-upload">
        <Link to={'/cafeupload'} className="cafe-upload-button">등록</Link>
      </div>
      {renderTable('승인 대기 목록', waitingList, 'waiting')}
      {renderTable('승인 완료 목록', approvedList, 'approved')}
    </div>
  );
};

export default MyCafeInfo;
