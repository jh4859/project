import React, { useState, useEffect, useContext } from 'react';  // useContext 추가
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { CafeContext } from "../CafeProvider"; // CafeContext 가져오기
import Tabs from "../community/Tabs";

const NoticePage = () => {
  const { posts, setPosts } = useContext(CafeContext); // useContext 사용
  const [inputTerm, setInputTerm] = useState(""); // 사용자 입력값
  const [searchTerm, setSearchTerm] = useState(""); // 실제 검색 트리거 값
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

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1 해줍니다.
    const day = String(d.getDate()).padStart(2, '0'); // 일도 두 자릿수로 맞춥니다.
    return `${year}. ${month}. ${day}`;
  };

  return (
    <div className="community-container">
      <Tabs />
      <div className="tab-content">
        <div className="community-board">
          <div className="community-top">
            <div className="community-title">
              <h2>소통창</h2>
            </div>
            <div className="search-box">
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
                  <tr key={p.id}>
                    <td className={p.content ? 'with-border' : ''}>
                      {(filteredPosts.length - (currentPage - 1) * postsPerPage - index)}
                    </td>
                    <td
                      onClick={() => navigate(`/${category}/${p.id}`)}
                      className={p.content ? 'with-border' : ''}
                    >
                      <strong>{p.title}</strong>
                    </td>
                    <td className={p.content ? 'with-border' : ''}>
                      {p.author || '관리자'}
                    </td>
                    <td className={p.content ? 'with-border' : ''}>
                      {formatDate(p.createDate)}
                    </td>
                    <td className={p.content ? 'with-border' : ''}>
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
            className={currentPage === index + 1 ? 'active' : ''}
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

export default NoticePage;
