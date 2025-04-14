import React, { useContext, useState } from "react";
import { CafeContext } from "../CafeProvider";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Tabs from "../Tabs";
import axios from "axios";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const WritePage2 = () => {
  const { addBoard } = useContext(CafeContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // CKEditor에서 작성한 내용을 저장
  const [files, setFiles] = useState([]); // 파일 상태 추가
  const navigate = useNavigate();
  const location = useLocation();
  const { category } = useParams();

  // 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content); // CKEditor에서 입력된 내용
    formData.append("category", category);

    // 파일이 있을 경우, FormData에 파일 추가
    files.forEach((file) => {
      formData.append("files", file);
    });

    // Axios를 사용해 데이터를 서버로 전송
    try {
      await axios.post(`/api/board/${category}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate(`/${category}`); // 게시물 등록 후 해당 카테고리 페이지로 이동
    } catch (error) {
      console.error("게시물 등록 실패:", error);
    }
  };

  // 파일 선택 처리 함수
  const handleFileChange = (e) => {
    setFiles([...e.target.files]); // 파일 상태 업데이트
  };

  const handleCancel = () => {
    navigate(`/${category}`);
  };

  return (
    <>
      <Tabs activeTab={location.pathname} />
      <div className="add-board-wrapper">
        <h1 className="form-title">게시물 등록</h1>
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="file-title">
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

          <div className="file-content">
            <label htmlFor="content">내용</label>
            <CKEditor
              editor={ClassicEditor}
              data={content}
              onChange={(event, editor) => {
                const data = editor.getData();
                setContent(data); // CKEditor에서 입력한 데이터를 content 상태에 저장
              }}
              config={{
                ckfinder: {
                  // 서버에 이미지 업로드 URL 설정
                  uploadUrl: "http://localhost:8080/api/board/image-upload", 
                },
              }}
            />
          </div>

          <div className="file-upload">
            <label htmlFor="file">첨부 파일</label>
            <input
              type="file"
              id="file"
              multiple
              onChange={handleFileChange} // 파일 변경 시 상태 업데이트
            />
          </div>

          <div className="button-group">
            <button type="submit" className="submit-btn">등록</button>
            <button type="button" className="cancel-btn" onClick={handleCancel}>취소</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default WritePage2;
