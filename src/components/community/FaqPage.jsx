import { useState, useEffect, useContext } from "react";
import { CafeContext } from "../CafeProvider";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Tabs from "../community/Tabs";
import React from 'react';
import axios from 'axios';

const FaqPage = () => {
  const { posts, setPosts } = useContext(CafeContext); // useContext 사용
  const [inputTerm, setInputTerm] = useState(""); // 사용자 입력값
  const [searchTerm, setSearchTerm] = useState(""); // 실제 검색 트리거 값
  const [searchCategory, setSearchCategory] = useState('title');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [openPost, setOpenPost] = useState(null);  // 드롭다운 상태 관리
  const navigate = useNavigate();
  const { category } = useParams();

   // 게시물 필터링 (검색 기능)
   const filteredPosts = Array.isArray(posts)
   ? posts
       .filter((post) => post.category === "faq")
       .filter((post) =>
         post[searchCategory]
           ? post[searchCategory].toLowerCase().includes(searchTerm.toLowerCase())
           : false
       )
   : [];
 
   // 검색 제출 시 페이지 리셋
   const handleSearchSubmit = (e) => {
     e.preventDefault();
     setSearchTerm(inputTerm);  // 이때만 검색 실행
     setCurrentPage(1);
   };
 
   // ✅ 게시글 목록 불러오기
   useEffect(() => {
     fetchPosts();
   }, []);
 
   const fetchPosts = async () => {
     try {
       const res = await axios.get('/api/board');
       setPosts(res.data); // 예: [{ id: 1, title: '', content: '', category: 'notice' }, ...]
     } catch (err) {
       console.error('게시글 목록 불러오기 실패', err);
     }
   };
 
   // 게시물 정렬
   const sortedPosts = filteredPosts.sort((a, b) => b.id - a.id);
 
    // "글쓰기" 버튼 클릭 시
    const handleClick = () => {
     navigate(`/${category}/add`);
   };
 
   // 페이지네이션 계산
   const indexOfLastPost = currentPage * postsPerPage;
   const indexOfFirstPost = indexOfLastPost - postsPerPage;
   const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);
 
   // 페이지 번호 클릭 시
   const handlePageClick = (page) => {
     setCurrentPage(page);
   };

  // 드롭다운 열기/닫기
  const togglePost = (id) => {
    setOpenPost(openPost === id ? null : id); // 동일한 게시물을 클릭하면 닫고, 다른 게시물을 클릭하면 열기
  };

  //텍스트 출력
  const stripHtmlTags = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  return (
    <div className="faq-container">
      <Tabs />
        <div className="faq-board">
          <div className="faq-top">
            <div className="faq-title">
              <h2>자주하는 질문</h2>
            </div>
            <div className="faq-search-box">
              <form onSubmit={handleSearchSubmit}>
                <select value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)}>
                  <option value="title">제목</option>
                  <option value="author">작성자</option>
                </select>
                <input
                  type="text"
                  placeholder="내용을 입력해주세요."
                  value={inputTerm}
                  onChange={(e) => setInputTerm(e.target.value)}
                />
                <button type="submit">검색</button>
              </form>
            </div>
          </div>

          {/* 게시물 목록 */}
          <div className="faq-list">
            {currentPosts.length === 0 ? (
              <div>게시글이 없습니다.</div>
            ) : (
              currentPosts.map((p, index) => (
                <div key={p.id} className={`faq-item ${openPost === p.id ? 'open' : ''}`}>
                  <div className="faq-item-header" onClick={() => togglePost(p.id)}>
                    <p>{p.title}</p>
                  </div>
                  {openPost === p.id && (
                    <div className="faq-item-details">
                      <p dangerouslySetInnerHTML={{ __html: p.content }} />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      <div className="button-section">
        <div className="add-btn">
          <button onClick={handleClick}>글쓰기</button>
        </div>
      </div>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          이전
        </button>

        {Array.from({ length: Math.ceil(filteredPosts.length / postsPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageClick(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() =>
            setCurrentPage((p) =>
              p < Math.ceil(filteredPosts.length / postsPerPage) ? p + 1 : p
            )
          }
          disabled={currentPage === Math.ceil(filteredPosts.length / postsPerPage)}
        >
          이후
        </button>
      </div>
    </div>
  );
};

export default FaqPage;
