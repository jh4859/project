import { useState, useEffect, useContext } from "react";
import { CafeContext } from "../CafeProvider";
import { useNavigate } from "react-router-dom";
import Tabs from "../Tabs";
import axios from "axios";
import React from 'react';

const NoticePage = () => {
  const { posts, setPosts } = useContext(CafeContext);  // setPosts도 받아옵니다.
  const [searchTerm, setSearchTerm] = useState(''); // 검색어 상태
  const [searchCategory, setSearchCategory] = useState('title'); // 검색 카테고리
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [postsPerPage] = useState(10); // 한 페이지 당 게시글 개수
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // 게시물 필터링 (검색 기능)
  const filteredPosts = posts
    .filter((post) => post.category === "notice") // 카테고리 고정
    .filter((post) =>
      post[searchCategory]
        ? post[searchCategory].toLowerCase().includes(searchTerm.toLowerCase())
        : false // author가 없을 경우 검색 제외
    );

  // 게시물 정렬
  const sortedPosts = filteredPosts.sort((a, b) => b.id - a.id);

  // 페이지네이션 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);

  // "글쓰기" 버튼 클릭 시
  const handleClick = () => {
    navigate(`/notice/add`);
  };

  // 검색 제출 시 페이지 리셋
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // 검색 시 첫 페이지로 리셋
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1 해줍니다.
    const day = String(d.getDate()).padStart(2, '0'); // 일도 두 자릿수로 맞춥니다.
    return `${year}. ${month}. ${day}`;
  };

  // 페이지 번호 클릭 시
  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="community-container">
      <Tabs />
      <div className="community-board">
        <div className="community-top">
          <div className="community-title">
            <h2>공지사항</h2>
          </div>
          <div className="search-box">
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

        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody>
            {currentPosts.length === 0 ? (
              <tr>
                <td colSpan="4">게시글이 없습니다.</td>
              </tr>
            ) : (
              currentPosts.map((p, index) => (
                <tr key={p.id}>
                  <td
                    className={p.content ? 'with-border' : ''}  // content가 있을 때만 border 추가
                  >
                    {(filteredPosts.length - (currentPage - 1) * postsPerPage - index)}
                  </td>
                  <td
                    onClick={() => navigate(`/chat/${p.id}`)}
                    className={p.content ? 'with-border' : ''}  // content가 있을 때만 border 추가
                  >
                    <strong>{p.title}</strong>
                  </td>
                  <td
                    className={p.content ? 'with-border' : ''}  // content가 있을 때만 border 추가
                  >
                    {p.author || "관리자"}
                  </td>
                  <td
                    className={p.content ? 'with-border' : ''}  // content가 있을 때만 border 추가
                  >
                    {formatDate(p.createDate)}
                  </td>
                  <td
                    className={p.content ? 'with-border' : ''}  // content가 있을 때만 border 추가
                  >
                    {p.views || 0}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="button-section">
        <div className="add-btn">
          <button onClick={handleClick}>글쓰기</button>
        </div>
      </div>

      <div className="pagination">
        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
          이전
        </button>

        {Array.from({ length: Math.ceil(filteredPosts.length / postsPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageClick(index + 1)} // 페이지 숫자 클릭 시 현재 페이지로 설정
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

export default NoticePage;
