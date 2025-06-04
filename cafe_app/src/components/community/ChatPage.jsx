import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { CafeContext } from "../CafeProvider";
import Tabs from "../community/Tabs";

const ChatPage = () => {
  const { posts, setPosts } = useContext(CafeContext);
  const [inputTerm, setInputTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState('title');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const navigate = useNavigate();
  const { category } = useParams();

  // 게시물 필터링 (검색 기능)
  const filteredPosts = Array.isArray(posts)
    ? posts
        .filter((post) => post.category === "chat")
        .filter((post) =>
          post[searchCategory]
            ? post[searchCategory].toLowerCase().includes(searchTerm.toLowerCase())
            : false
        )
    : [];

  // 검색 제출 시 페이지 리셋
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchTerm(inputTerm);
    setCurrentPage(1);
  };

  // 게시글 목록 불러오기
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/board', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(res.data);
    } catch (err) {
      console.error('게시글 목록 불러오기 실패', err);
    }
  };

  const sortedPosts = filteredPosts.sort((a, b) => b.id - a.id);

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

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}. ${month}. ${day}`;
  };

  return (
    <div className="community-container">
      <Tabs activeCategory={category} />
      <div className="tab-content">
        <div className="community-board">
          <div className="breadcrumb-list-board">
            <span className="breadcrumb-list-home"><i class="fa-solid fa-house"></i></span>
            <span className="breadcrumb-list-arrow">&gt;</span>
            <span className="breadcrumb-list-info">소통창</span>
          </div>
          <div className="community-top">
            <div className="community-title">
              <h2>소통창</h2>
            </div>
            <div className="search-box">
              <form onSubmit={handleSearchSubmit}>
                <select value={searchCategory} onChange={(e) => setSearchCategory(e.target.value)}>
                  <option value="title">제목</option>
                  <option value="nickname">작성자</option>
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

          <table>
            <thead>
              <tr>
                <th>번호</th>
                <th>제목</th>
                <th>작성자</th>
                <th>작성일</th>
                <th>조회수</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.length === 0 ? (
                <tr>
                  <td colSpan="5">게시글이 없습니다.</td>
                </tr>
              ) : (
                currentPosts.map((p, index) => (
                  <tr key={p.id} className={currentPosts.length > 0 ? 'with-border' : ''}>
                    <td>
                      {(filteredPosts.length - (currentPage - 1) * postsPerPage - index)}
                    </td>
                    <td onClick={() => navigate(`/${category}/${p.id}`)}>
                      <strong>{p.title}</strong>
                    </td>
                    <td>
                      {p.nickname || "알 수 없음"}
                    </td>
                    <td>
                      {formatDate(p.createDate)}
                    </td>
                    <td>
                      {p.views || 0}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="button-section">
        <div className="add-btn">
          <button onClick={handleClick}>글쓰기</button>
        </div>
      </div>

      <div className="pagination-comm">
        <button className='pagination-comm-left'
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          <i class="fas fa-angle-left"></i> 
        </button>
        
      {filteredPosts.length > 0 ? (
          [...Array(Math.ceil(filteredPosts.length / postsPerPage))].map((_, index) => (
            <span
              key={index + 1}
              className={currentPage === index + 1 ? "notice-active" : ""}
              onClick={() => handlePageClick(index + 1)}
            >
              {index + 1}
            </span>
          ))
        ) : (
          <span className="notice-active">1</span> // 게시글이 없을 때 페이지는 기본적으로 1로 표시
        )}
        <button className='pagination-comm-right'
          onClick={() =>
            setCurrentPage((p) =>
              p < Math.ceil(filteredPosts.length / postsPerPage) ? p + 1 : p
            )
          }
          disabled={currentPage === Math.ceil(filteredPosts.length / postsPerPage)}
        >
          <i class="fas fa-angle-right"></i>
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
