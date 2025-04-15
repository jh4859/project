import { useNavigate, useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { CafeContext } from "../CafeProvider";
import Tabs from "../Tabs";

import React from 'react';
import axios from 'axios';

function DetailPage() {
    const { posts, addComment } = useContext(CafeContext);  
    const { category, postId } = useParams();
    const navigate = useNavigate();
    const [comment, setComment] = useState("");
    const [fileURLs, setFileURLs] = useState([]);
    const [files, setFiles] = useState([]); // 파일 상태 추가

    const post = posts.find((p) => p.id === parseInt(postId));

    const formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}. ${month}. ${day} ${hours}:${minutes}`;
    };

    useEffect(() => {
        const fetchPost = async () => {
          try {
            const response = await axios.get(`/api/board/${category}/${postId}`);
            setPost(response.data);
          } catch (error) {
            console.error("게시물 가져오기 실패:", error);
          }
        };
        
        fetchPost();
      }, [postId, category]);
    

    // 📌 게시물이 없을 때 예외 처리
    if (!post) {
        return (
            <div className="not-found">
                <h2>게시물을 찾을 수 없습니다.</h2>
                <button onClick={() => navigate(`/${category}`)}>목록으로 돌아가기</button>
            </div>
        );
    }

    const handleCommentChange = (e) => setComment(e.target.value);

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (comment.trim()) {
            addComment(postId, comment);
            setComment("");
        } else {
            alert("댓글을 입력해주세요.");
        }
    };

    // 📌 현재 카테고리로 이동하도록 수정
    const handleClick = () => navigate(`/${category}`);

    return (
        <>
        {/* 📌 현재 탭을 category로 설정 */}
        <Tabs activeTab={category} setActiveTab={(tab) => navigate(`/${tab}`)} />
        <div className="main-container">
            <div className="title-section">
                <div className="title"><h2>{post.title}</h2></div>
                <div className="info">
                    <span>작성자: 관리자</span>
                    <span>작성일: {formatDate(post.createDate)}</span>
                </div>
            </div>
            
            {/* 모든 첨부파일 다운로드 목록 */}
            {post.files && post.files.length > 0 && (
                <div className="attached-files">
                    <p>첨부파일:</p>
                    <ul>
                        {fileURLs.map((file, index) => (
                            <li key={index}>
                               <a
                                    href={`http://localhost:8080/api/board/download/${file.savedName}`}
                                    download
                                >
                                    {file.originalName}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="content">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            <div className="list-btn">
                <button onClick={handleClick}>목록</button>
            </div>
        </div>

        <div className="comment-section">
            <div className="commentlist">
                <h4>댓글</h4>
                <div className="commentlist-section">
                    {(post.comments || []).map((comment, index) => (
                        <div className="comments" key={index}>
                            <span>{comment.author}</span>
                            <p>{comment.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="add-comment">
                <h4>댓글쓰기</h4>
                <div className="write-section">
                    <form onSubmit={handleCommentSubmit}>
                        <div className="write-comment">
                            <textarea
                                id="comment"
                                name="comment"
                                placeholder="댓글을 입력해주세요."
                                value={comment}
                                onChange={handleCommentChange}
                                required
                            />
                        </div>
                        <div className="write-btn">
                            <button type="submit">등록</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </>
    );
}

export default DetailPage;