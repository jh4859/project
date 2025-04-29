import { useNavigate, useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { CafeContext } from "../CafeProvider";
import React from 'react';
import axios from 'axios';
import Tabs from "../community/Tabs";

function DetailPage() {
  const { addComment } = useContext(CafeContext);
  const { category, postId } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}. ${String(d.getMonth()+1).padStart(2,'0')}. ${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  };

  useEffect(() => {
    axios.get(`/api/board/${category}/${postId}`)
      .then(res => setPost(res.data))
      .catch(err => console.error(err));
  }, [category, postId]);

  // 이미지 썸네일 처리
  useEffect(() => {
    if (!post) return;
    const contentEl = document.querySelector('.content');
    if (!contentEl) return;

    contentEl.querySelectorAll('img').forEach(img => {
      const originalSrc = img.src;
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = originalSrc;
      image.onload = () => {
        const size = 600;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        const scale = Math.min(size / image.width, size / image.height); // 비율 유지
        const scaledWidth = image.width * scale;
        const scaledHeight = image.height * scale;
        const x = (size - scaledWidth) / 2;
        const y = (size - scaledHeight) / 2;

        ctx.fillStyle = "#fff"; // 배경 흰색
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(image, x, y, scaledWidth, scaledHeight);

        const thumbnail = canvas.toDataURL("image/jpeg");

        img.src = thumbnail;
        img.classList.add('thumbnail-image');
      };
    });

    return () => {
      contentEl.querySelectorAll('img').forEach(img => img.onclick = null);
    };
  }, [post]);

  const handleCommentSubmit = e => {
    e.preventDefault();
    if (!comment.trim()) return alert("댓글을 입력해주세요.");
    addComment(postId, comment);
    setComment("");
  };

  if (!post) return <p>Loading…</p>;

  return (
    <>
      <Tabs activeTab={category} setActiveTab={tab => navigate(`/${tab}`)} />

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
                  <a href={`http://localhost:8080/api/board/download/${f.savedName}`} download>
                    {f.originalName}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="content" dangerouslySetInnerHTML={{ __html: post.textContent }} />

        {/* 이미지 썸네일 */}
        <div className="images">
          {post.imageUrls && post.imageUrls.length > 0 && post.imageUrls.map((url, idx) => (
            <img
              key={idx}
              src={url.startsWith("http") ? url : `${window.location.origin}${url}`}
              alt={`첨부이미지-${idx}`}
              className="thumbnail-image"
            />
          ))}
        </div>

        <div className="list-btn">
          <button onClick={() => navigate(`/${category}`)}>목록</button>
        </div>
      </div>

      <div className="comment-section">
        <h4>댓글</h4>
        <div className="commentlist-section">
          {post.comments?.map((c, i) => (
            <div className="comments" key={i}>
              <span>{c.author}</span>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
        <form className="add-comment write-section" onSubmit={handleCommentSubmit}>
          <textarea
            placeholder="댓글을 입력해주세요."
            value={comment}
            onChange={e => setComment(e.target.value)}
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
