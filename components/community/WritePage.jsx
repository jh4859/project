import { useContext, useState } from "react";
import { CafeContext } from "../CafeProvider";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Tabs from "../Tabs";

const AddBoard = () => {
  const { addBoard } = useContext(CafeContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { category } = useParams();

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  // 폼 제출 시 호출되는 함수 (비동기 처리)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 게시물 추가 함수 호출
    try {
      await addBoard(title, content, files, category); // 비동기 호출

      // 게시물 추가 후 공지사항 목록 페이지로 이동
      navigate(`/community/${category}`); 
    } catch (error) {
      console.error("게시물 등록 중 오류 발생:", error);
      // 에러가 발생한 경우 추가 처리 필요 (예: 오류 메시지 표시)
    }
  };

  // 취소 버튼 핸들러
  const handleCancel = () => {
    navigate(`/community/${category}`); // 현재 카테고리로 돌아가기
  };

  return (
    <>
      <Tabs activeTab={location.pathname} /> {/* URL 기반으로 activeTab 설정 */}
      <div className="add-board-wrapper">
        <h1 className="form-title">게시물 등록</h1>
        <form className="form-container" onSubmit={handleSubmit}> {/* onSubmit 사용 */}
          <div className="file-title">
            <label htmlFor="title">제목</label>
            <input type="text"id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목을 입력하세요" required/>
          </div>
          <div className="file-content">
            <label htmlFor="content">내용</label>
            <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="내용을 입력하세요" required/>
          </div>
          <div className="file-upload">
            <label className="upload-title">파일첨부</label>
            <div className="file-row">
              <textarea className="file-name-input" value={files.map((file) => file.name).sort().join()} readOnly placeholder="선택된 파일 목록" rows={files.length || 2}/>
              <label className="upload-button">
                업로드
                <input type="file" onChange={handleFileChange} multiple hidden />
              </label>
            </div>
          </div>

          <div className="button-group">
            <button type="submit" className="submit-btn">
              등록
            </button>
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              취소
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddBoard;
