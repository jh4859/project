import { useState, useContext } from "react";
import { CafeContext } from "../CafeProvider";
import { useNavigate } from "react-router-dom";

const AddBoard = () => {
  const { addBoard } = useContext(CafeContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    addBoard(title, content, file);
    navigate("/community");
  };

  return (
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
            <input type="text" value={file ? file.name : ""} readOnly placeholder="파일이름" className="file-name-input"/>
            <label className="upload-button">
              업로드
              <input type="file" onChange={(e) => setFile(e.target.files[0])} hidden/>
            </label>
          </div>
        </div>

        <div className="button-group">
          <button type="submit" className="submit-btn">등록</button>
          <button type="button" className="cancel-btn" onClick={() => navigate("/community")}>취소</button>
        </div>
      </form>
    </div>
  );
};

export default AddBoard;
