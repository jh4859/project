import React, { useContext, useState, useEffect } from "react";
import { CafeContext } from "../CafeProvider";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import Tabs from "../community/Tabs";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { parse } from "node-html-parser";

const WritePage = () => {
  const { category, postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [existingImages, setExistingImages] = useState([]); // 최초 로딩 시 받아온 이미지 목록
  const [imagesToKeep, setImagesToKeep] = useState([]); // 삭제되지 않은 이미지 목록
  const [nickname, setNickname] = useState("");
  const [allFiles, setAllFiles] = useState([]);
  const [deletedFileIds, setDeletedFileIds] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  // 이미지 업로드 어댑터
  function CustomUploadAdapterPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return new CustomUploadAdapter(loader);
    };
  }

  class CustomUploadAdapter {
    constructor(loader) {
      this.loader = loader;
    }

    upload() {
      return this.loader.file.then((file) => {
        const formData = new FormData();
        formData.append("upload", file);

        return fetch("http://localhost:8080/api/board/image-upload", {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then((result) => {
            setImageFiles((prev) => [...prev, file]);
            return { default: result.url };
          })
          .catch((err) => {
            console.error("이미지 업로드 실패:", err);
            return Promise.reject(err);
          });
      });
    }

    abort() {}
  }

  const parseContent = (htmlContent) => {
    const root = parse(htmlContent);
    let placeholderHtml = htmlContent;
    const images = [];

    root.querySelectorAll("img").forEach((img, idx) => {
      const src = img.getAttribute("src");
      const outerHtml = img.toString();
      const placeholder = `[[IMG${idx}]]`;
      placeholderHtml = placeholderHtml.replace(outerHtml, placeholder);
      images.push(src);
    });

    return { textContent: placeholderHtml, images };
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedNickname = localStorage.getItem("nickname");

    if (!token || !storedNickname) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    setNickname(storedNickname);

    if (postId) {
      axios
        .get(`/api/board/${category}/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const data = res.data;
          setTitle(data.title || "");
          setExistingImages(data.imageUrls || []);
          setImagesToKeep(data.imageUrls || []);

          let restoredContent = data.textContent || "";
          (data.imageUrls || []).forEach((url, idx) => {
            const fixedUrl = url.startsWith("http")
              ? url
              : `http://localhost:8080/${url}`;
            const imgTag = `<img src="${fixedUrl}" alt="이미지${idx}" />`;
            restoredContent = restoredContent.replace(`[[IMG${idx}]]`, imgTag);
          });
          setContent(restoredContent);

          const filesMeta = (data.files || []).map((file) => ({
            id: file.id,
            originalName: file.originalName,
            fileType: file.fileType,
            fileSize: file.fileSize,
            isNew: false,
          }));
          setAllFiles(filesMeta);
        })
        .catch((err) => {
          console.error("게시글 불러오기 실패:", err);
          alert("게시글을 불러올 수 없습니다.");
          navigate(`/${category}`);
        });
    }
  }, [category, postId, navigate]);

  const handleRemoveFile = (index) => {
    const fileToRemove = allFiles[index];
    if (!fileToRemove) return;

    if (fileToRemove.isNew) {
      setAllFiles((prev) => prev.filter((_, i) => i !== index));
    } else {
      setDeletedFileIds((prev) => [...prev, fileToRemove.id]);
      setAllFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).map((file) => ({
      fileObj: file,
      name: file.name,
      isNew: true,
    }));
    setAllFiles((prev) => [...prev, ...newFiles]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    const { textContent, images } = parseContent(content);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("textContent", textContent);
    formData.append("nickname", nickname);
    images.forEach(img => formData.append("imageUrls", img));
    deletedFileIds.forEach((id) => formData.append("deletedFileIds", id));

    const imageFilenamesToKeep = imagesToKeep.map((src) => {
      return src?.split("/uploads/")[1];
    });
    formData.append("imagesToKeep", JSON.stringify(imageFilenamesToKeep));

    allFiles.forEach((file) => {
      if (file.isNew && file.fileObj) {
        formData.append("files", file.fileObj);
      }
    });

    imageFiles.forEach((file) => formData.append("imageFiles", file));

    try {
      if (postId) {
        await axios.post(`/api/board/edit/${category}/${postId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        alert("게시글이 수정되었습니다.");
      } else {
        await axios.post(`/api/board/${category}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        alert("게시글이 등록되었습니다.");
      }
      navigate(`/${category}`);
    } catch (err) {
      console.error("게시글 저장 실패:", err);
      alert("게시글 저장에 실패했습니다.");
    }
  };

  const handleCancel = () => {
    navigate(`/${category}`);
  };

  const categoryLabel = {
    notice: "공지사항",
    chat: "소통창",
    faq: "자주하는 질문",
  };
  const categoryName = categoryLabel[category] || category;

  return (
    <>
      <Tabs activeCategory={category} />
      <div className="add-board-wrapper">
        <h1 className="form-title">
          {categoryName} {postId ? "게시물 수정" : "게시물 등록"}
        </h1>
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="file-title">
            <label htmlFor="title">제목</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="제목을 입력하세요"
            />
          </div>

          <div className="content-editor">
            <label htmlFor="content">내용</label>
            <CKEditor
              editor={ClassicEditor}
              config={{
                extraPlugins: [CustomUploadAdapterPlugin],
                removePlugins: ["MediaEmbed"],
              }}
              data={content}
              onChange={(_, editor) => {
                const data = editor.getData();
                setContent(data);

                const root = parse(data);
                const currentFilenames = root
                  .querySelectorAll("img")
                  .map((img) => img.getAttribute("src")?.split("/uploads/")[1])
                  .filter((filename) => !!filename);

                const updatedToKeep = existingImages.filter((src) => {
                  const filename = src?.split("/uploads/")[1];
                  return currentFilenames.includes(filename);
                });

                setImagesToKeep(updatedToKeep);
              }}
            />
          </div>

          <div className="file-upload-container">
            <label htmlFor="file-upload" className="file-upload-label">
              첨부파일
            </label>

            {/* 실제 파일 input은 숨기고 커스텀 버튼으로 클릭 */}
            <input
              type="file"
              id="file-upload"
              multiple
              onChange={handleFileChange}
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
              style={{ display: "none" }}
            />

            <div className="file-upload-content">
              {/* 파일 선택 버튼 */}
              <button
                type="button"
                className="file-upload-button"
                onClick={() => document.getElementById("file-upload").click()}
              >
                파일 선택
              </button>

              {/* 파일 목록 */}
              <div className="file-list">
                {allFiles.length > 0 ? (
                  <ul className="file-list-ul">
                    {allFiles.map((file, idx) => (
                      <li key={file.id || file.name || idx} className="file-item">
                        <span>{file.isNew ? file.name : file.originalName}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(idx)}
                          className="file-remove-btn"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="file-empty">선택된 파일이 없습니다.</p>
                )}
              </div>
            </div>

            {/* 안내 문구 */}
            <p className="file-upload-note">
              * 이미지를 제외한 파일을 업로드할 수 있습니다.
            </p>
          </div>

          <div className="button-group">
            <button type="button" className="cancel-btn" onClick={handleCancel}>
              취소
            </button>
            <button type="submit" className="submit-btn">
              {postId ? "수정" : "등록"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default WritePage;
