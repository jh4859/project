import React, { useContext, useState } from "react";
import { CafeContext } from "../CafeProvider";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Tabs from "../community/Tabs";
import axios from "axios";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { parse } from 'node-html-parser'; // ✅ 추가

const WritePage = () => {
  const { addBoard } = useContext(CafeContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // CKEditor에서 작성한 전체 HTML 저장
  const [files, setFiles] = useState([]);
  const [imageFiles, setImageFiles] = useState([]); // 이미지 파일 추가
  const navigate = useNavigate();
  const location = useLocation();
  const { category } = useParams();

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
            // 이미지 URL만 리턴받고, 해당 파일을 imageFiles 배열에 추가
            setImageFiles(prev => [...prev, file]); // 이미지 파일을 배열에 저장
            return {
              default: `http://localhost:8080${result.url}` // 이미지 URL 리턴
            };
          })
          .catch(err => {
            console.error("이미지 업로드 실패:", err);
            return Promise.reject(err);
          });
      });
    }

    abort() {}
  }

  // ✅ content에서 텍스트, 이미지 리스트 추출하는 함수
  const parseContent = (htmlContent) => {
    const root = parse(htmlContent);

    // 이미지 src 추출
    const images = root.querySelectorAll('img').map(img => img.getAttribute('src'));

    // 텍스트만 추출 (img 태그 삭제)
    root.querySelectorAll('img').forEach(img => img.remove());
    const textContent = root.toString(); // 텍스트만 남은 HTML

    console.log("추출된 이미지 URL들:", images); // ✅ 이미지 URL 확인

    return { textContent, images };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { textContent, images } = parseContent(content); // ✅ content 분리

    const formData = new FormData();
    formData.append("title", title);
    formData.append("textContent", textContent); // 텍스트 본문
    formData.append("category", category);
    formData.append("imageUrls", JSON.stringify(images)); // 이미지는 JSON 문자열로 보내기
    
    // FormData 내용 확인하기
    console.log("FormData 내용:");
    formData.forEach((value, key) => {
      console.log(key + ": " + value);
    });

    // 파일들 추가 (일반 파일)
    files.forEach((file) => {
      formData.append("files", file);
    });

    // 이미지 파일들 추가 (이미지 파일)
    imageFiles.forEach((file) => {
      formData.append("imageFiles", file); // imageFiles에 저장된 파일들을 추가
    });

    try {
      await axios.post(`/api/board/${category}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
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

export default WritePage;
