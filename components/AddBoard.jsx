import { useContext, useState } from "react";
import { CafeContext } from "../CafeProvider";
import { useNavigate, useLocation } from "react-router-dom";
import Tabs from "../components/Tabs";

const AddBoard = () => {
  const { addBoard } = useContext(CafeContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addBoard(title, content, files);
    navigate("/community/notice");
  };

  return (
    <>
      <Tabs activeTab={location.pathname} /> {/* URL 기반으로 activeTab 설정 */}
      <div className="add-board-wrapper">
        <h1 className="form-title">게시물 등록</h1>
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">제목</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">내용</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
              required
            />
          </div>
          <div className="form-group file-upload">
            <label>파일첨부</label>
            <div className="file-row">
              <textarea
                className="file-name-input"
                value={files.map((file) => file.name).sort().join("\n")}
                readOnly
                placeholder="선택된 파일 목록"
                rows={files.length || 2}
              />
              <label className="upload-button">
                업로드
                <input type="file" onChange={handleFileChange} multiple hidden />
              </label>
            </div>
          </div>

          <div className="button-group">
            <button type="submit" className="submit-btn">등록</button>
            <button type="button" className="cancel-btn" onClick={() => navigate("/community")}>
              취소
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddBoard;
