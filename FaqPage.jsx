import { useState, useEffect, useContext } from "react";
import { CafeContext } from "../CafeProvider";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Tabs from "../Tabs";
import React from 'react';
import axios from 'axios';

const FaqPage = () => {
  const { posts } = useContext(CafeContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('title');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const [openPost, setOpenPost] = useState(null);  // 드롭다운 상태 관리
  const navigate = useNavigate();
  const { category } = useParams();

  // 게시물 필터링 (검색 기능)
  const filteredPosts = posts
  .filter((post) => post.category === "faq") // 카테고리 고정
  .filter((post) =>
    post[searchCategory] 
      ? post[searchCategory].toLowerCase().includes(searchTerm.toLowerCase())
      : false // author가 없을 경우 검색 제외
  );

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

  const sortedPosts = filteredPosts.sort((a, b) => b.id - a.id);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handleClick = () => {
    navigate(`/${category}/add`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}. ${month}. ${day}`;
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  // 드롭다운 열기/닫기
  const togglePost = (id) => {
    setOpenPost(openPost === id ? null : id); // 동일한 게시물을 클릭하면 닫고, 다른 게시물을 클릭하면 열기
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
                  type="search"
                  placeholder="내용을 입력해주세요."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                    {/* <span>{(filteredPosts.length - (currentPage - 1) * postsPerPage - index)}</span> */}
                    <p>{p.title}</p>
                  </div>
                  {openPost === p.id && (
                    <div className="faq-item-details">
                      <p>{p.content}</p>
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
