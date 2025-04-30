import { useNavigate, useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { CafeContext } from "../CafeProvider";
import React from "react";
import axios from "axios";
import Tabs from "../community/Tabs";

function DetailPage() {
  const { addComment } = useContext(CafeContext);
  const { category, postId } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, "0")}. ${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  useEffect(() => {
    axios.get(`/api/board/${category}/${postId}`)
      .then((res) => {
        console.log("full post payload:", res.data);
        setPost(res.data);
        setComments(res.data.comments || []);
      })
      .catch((err) => console.error(err));
  }, [category, postId]);

  // 이미지 썸네일 처리
  useEffect(() => {
    if (!post) return;

    const contentEl = document.querySelector(".content");
    if (!contentEl) return;

    contentEl.querySelectorAll("img").forEach((img) => {
      const originalSrc = img.src;
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = originalSrc;

      image.onload = () => {
        const maxSize = 600;
        const scale = Math.min(maxSize / image.width, maxSize / image.height);
        const scaledWidth = image.width * scale;
        const scaledHeight = image.height * scale;
      
        const canvas = document.createElement("canvas");
        canvas.width = scaledWidth;
        canvas.height = scaledHeight;
      
        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, scaledWidth, scaledHeight);
      
        const thumbnail = canvas.toDataURL("image/jpeg");
        img.src = thumbnail;
        img.classList.add("thumbnail-image");
      };
    });

    return () => {
      contentEl.querySelectorAll("img").forEach((img) => (img.onclick = null));
    };
  }, [post]);

  // 댓글 등록
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return alert("댓글을 입력해주세요.");

    try {
      await axios.post(`/api/comments/${postId}`, {
        author: "관리자",
        comment: comment,
      });
      setComment("");

      const res = await axios.get(`/api/board/${category}/${postId}`);
      setPost(res.data);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error("댓글 등록 실패:", err);
      alert("댓글 등록 중 오류가 발생했습니다.");
    }
  };

  if (!post) return <p>게시글을 불러오는 중입니다...</p>;

  console.log("textContent", post.textContent);
  console.log("imageUrls", post.imageUrls);

// 본문 이미지 치환
let html = post.textContent;
const imageUrls = Array.isArray(post?.imageUrls) ? post.imageUrls : [];

imageUrls.forEach((url, idx) => {
  const token = new RegExp(`\\[\\[IMG${idx}\\]\\]`, "g");  // 정규식 객체로 수정
  const fullUrl = url.startsWith("http")
    ? url
    : `${window.location.origin}/api/images/${url}`;

  html = html.replace(
    token,
    `<img src="${fullUrl}" alt="이미지${idx}"/>`
  );
});

  const isImageInHtml = html.includes("<img");

  return (
    <>
      <Tabs activeTab={category} setActiveTab={(tab) => navigate(`/${tab}`)} />

      <div className="main-container">
        <div className="title-section">
          <h2>{post.title}</h2>
          <div className="info">
            <span>작성자: 관리자</span>
            <span>작성일: {formatDate(post.createDate)}</span>
          </div>
        </div>

        {post.files?.length > 0 && (
          <div className="attached-files">
            <p>첨부파일:</p>
            <ul>
              {post.files.map((f, i) => (
                <li key={i}>
                  <a
                    href={`http://localhost:8080/api/board/download/${f.savedName}`}
                    download
                  >
                    {f.originalName}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="content" dangerouslySetInnerHTML={{ __html: html }} />

        {/* 본문에 이미지가 없는 경우만 썸네일 보여줌 */}
        {!isImageInHtml && imageUrls.length > 0 && (
          <div className="images">
            {imageUrls.map((url, idx) => (
              <img
                key={idx}
                src={
                  url.startsWith("http")
                    ? url
                    : `${window.location.origin}/api/images/${url}`
                }
                alt={`첨부이미지-${idx}`}
                className="thumbnail-image"
              />
            ))}
          </div>
        )}

        <div className="list-btn">
          <button onClick={() => navigate(`/${category}`)}>목록</button>
        </div>
      </div>

      <div className="comment-section">
        <h4>댓글</h4>

        <div className="commentlist-section">
          {comments.length === 0 ? (
            <p>댓글이 없습니다.</p>
          ) : (
            comments.map((c, i) => (
              <div className="comments" key={i}>
                <p className="com_author">{c.author || '관리자'}</p>
                <p className="com_comment">{c.comment}</p>
                <p className="com_time">{formatDate(c.createdAt)}</p>
              </div>
            ))
          )}
        </div>

        <form className="add-comment write-section" onSubmit={handleCommentSubmit}>
          <h4>댓글작성</h4>
          <textarea
            placeholder="댓글을 입력해주세요."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
          <div className="write-btn">
            <button type="submit">등록</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default DetailPage;
