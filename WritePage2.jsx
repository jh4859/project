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

  // ✅ 커스텀 업로드 어댑터
  function CustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return new CustomUploadAdapter(loader);
    };
  }

  class CustomUploadAdapter {
    constructor(loader) {
      this.loader = loader;
    }

    upload() {
      return this.loader.file.then(file => {
        const formData = new FormData();
        formData.append('upload', file);

        return fetch('http://localhost:8080/api/board/image-upload', {
          method: 'POST',
          body: formData
        })
          .then(response => response.json())
          .then(result => {
            // 서버에서 { url: '/uploads/파일명.jpg' } 이런 식으로 반환됨
            return {
              default: `http://localhost:8080${result.url}`
            };
          })
          .catch(err => {
            console.error("이미지 업로드 실패:", err);
            return Promise.reject(err);
          });
      });
    }

    abort() {
      // 업로드 취소 시 처리할 내용 (생략 가능)
    }
  }

  // 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);

    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      await axios.post(`/api/board/${category}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert('게시글 등록 성공!');
      navigate(`/${category}`);
    } catch (error) {
      console.error("게시물 등록 실패:", error);
    }
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
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
              config={{
                extraPlugins: [CustomUploadAdapterPlugin],
              }}
              onChange={(event, editor) => {
                const data = editor.getData();
                setContent(data);
              }}
            />
          </div>

          <div className="file-upload">
            <label htmlFor="file">첨부 파일</label>
            <input
              type="file"
              id="file"
              multiple
              onChange={handleFileChange}
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
