import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import React from "react";
import Tabs from "../community/Tabs";

function DetailPage() {
  const { category, postId } = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  const nickname = localStorage.getItem("nickname");
  const token = localStorage.getItem("token");

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, "0")}. ${String(
      d.getDate()
    ).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}`;
  };

  useEffect(() => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    axios
      .get(`/api/board/${category}/${postId}`, { headers })
      .then((res) => {
        setPost(res.data);
        setComments(res.data.comments || []);
      })
      .catch((err) => console.error("게시글 로딩 실패:", err));
  }, [category, postId, token]);

  // 플레이스홀더( [[IMG0]] ) 기준으로 텍스트와 이미지를 분리해서 React 엘리먼트로 렌더링
  const renderContentWithImages = (htmlString, imageUrls) => {
    if (!htmlString) return null;

    // 정규식으로 [[IMG숫자]] 기준 분리
    const parts = htmlString.split(/\[\[IMG(\d+)\]\]/g);

    const elements = [];

    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        // 텍스트 부분 (HTML) dangerouslySetInnerHTML로 출력
        elements.push(
          <span key={`text-${i}`} dangerouslySetInnerHTML={{ __html: parts[i] }} />
        );
      } else {
        // 이미지 인덱스
        const imgIndex = parseInt(parts[i], 10);
        if (!imageUrls || !imageUrls[imgIndex]) continue;

        const url = imageUrls[imgIndex];
        const src = url.startsWith("http")
          ? url
          : `${window.location.origin}/api/images/${url}`;

        elements.push(
          <img
            key={`img-${imgIndex}`}
            src={src}
            alt={`이미지${imgIndex}`}
            className="thumbnail-image"
            style={{ maxWidth: "600px", borderRadius: "8px", cursor: "pointer" }}
            onClick={() => window.open(src, "_blank")}
          />
        );
      }
    }
    return elements;
  };

  if (!post) return <p>게시글을 불러오는 중입니다...</p>;

  const imageUrls = Array.isArray(post?.imageUrls) ? post.imageUrls : [];
  const contentElements = renderContentWithImages(post.textContent, imageUrls);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return alert("댓글을 입력해주세요.");
    if (!token) return alert("로그인이 필요합니다.");

    try {
      await axios.post(
        `/api/comments/${postId}`,
        {
          nickname: nickname,
          comment: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setComment("");

      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`/api/board/${category}/${postId}`, {
        headers,
      });
      setPost(res.data);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error("댓글 등록 실패:", err);
      alert("댓글 등록 중 오류가 발생했습니다.");
    }
  };

  const handleEditPost = () => {
    navigate(`/edit/${category}/${postId}`);
  };

  const handleDeletePost = async () => {
    const confirmDelete = window.confirm("정말로 게시글을 삭제하시겠습니까?");
    if (confirmDelete) {
      try {
        await axios.delete(`/api/board/${category}/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        navigate(`/${category}`);
      } catch (err) {
        console.error("게시글 삭제 실패:", err);
        alert("게시글 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const handleCommentDelete = (commentId) => {
  const confirmed = window.confirm("댓글을 삭제하시겠습니까?");
  if (!confirmed) return;

  axios
    .delete(`/api/comments/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => {
      alert("댓글이 삭제되었습니다.");
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    })
    .catch((err) => {
      console.error("댓글 삭제 실패", err);
      alert("댓글 삭제에 실패했습니다.");
    });
};

  return (
    <>
      <Tabs activeCategory={category} />
      <div className="allcontainer">
        <div className="main-container">
          <div className="title-section">
            <h2>{post.title}</h2>
            <div className="info">
              <span>작성자: {post.nickname}</span>
              <span>작성일: {formatDate(post.createDate)}</span>
            </div>
          </div>

          {post.files?.length > 0 && (
            <div className="attached-files">
              <p>첨부파일:</p>
              <ul>
                {post.files.map((f, i) => (
                  <li key={i}>
                    <a href={`http://localhost:8080/api/board/download/${f.savedName}`}
                      download
                    >
                      {f.originalName}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="content">{contentElements}</div>
        </div>

        {category === "chat" && (
          <div className="comment-section">
            <h4>댓글 {comments.length}개</h4>

            <div className="commentlist-section">
              {comments.length === 0 ? (
                <p>댓글이 없습니다.</p>
              ) : (
                comments.map((c, i) => (
                  <div className="comments" key={i}>                   
                    <div className="com-top">
                      <p className="com_author">{c.nickname}</p>
                      {(nickname === c.nickname || nickname === "admin") && (
                        <button
                          className="com-delete-btn"
                          onClick={() => handleCommentDelete(c.id)}
                        >
                          삭제
                        </button>
                      )}
                    </div>
                    <p className="com_comment">{c.comment}</p>
                    <p className="com_time">{formatDate(c.createdAt)}</p>
                  </div>
                ))
              )}
            </div>

            <form className="add-comment" onSubmit={handleCommentSubmit}>
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
        )}
      </div>
      <div className="list-btn-section">
        <div className="list-btn">
          {(nickname && post.nickname && (nickname === post.nickname || nickname === "admin")) && (
          <div className="edit-delete-buttons">
            <button className="com-edit-btn" onClick={handleEditPost}>수정</button>
            <button className="com-delete-btn" onClick={handleDeletePost}>삭제</button>
          </div>
          )}
          <button onClick={() => navigate(`/${category}`)}>목록</button>
        </div>
      </div>  
    </>
  );
}

export default DetailPage;
