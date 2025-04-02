import { useState, useEffect, useContext } from "react";
import { CafeContext } from "../CafeProvider";
import { useNavigate } from "react-router-dom";
import Tabs from "../Tabs";

const NoticePage = () => {
  const { posts } = useContext(CafeContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('title');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const navigate = useNavigate();

  // 게시물 필터링 (검색 기능)
  const filteredPosts = posts
    .filter((post) => post.category === "notice") // 카테고리 고정
    .filter((post) =>
      post[searchCategory]?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // id를 기준으로 오름차순으로 정렬
  const sortedPosts = filteredPosts.sort((a, b) => b.id - a.id);

  // 페이지네이션 계산
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);

  // "글쓰기" 버튼 클릭 시
  const handleClick = () => {
    navigate(`/community/notice/add`);
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

  return (
    <div className="community-container">
      <Tabs />
      <div className="tab-content">
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
                    {/* 번호 매기기 (오름차순) */}
                    <td>{(filteredPosts.length - (currentPage - 1) * postsPerPage - index)}</td>
                    <td
                      onClick={() => navigate(`/community/notice/${p.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <strong>{p.title}</strong>
                    </td>
                    <td>{p.author || "관리자"}</td>
                    <td>{formatDate(p.createDate)}</td>
                    <td>{p.views || 0}</td>
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
        {/* 이전 버튼 */}
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          이전
        </button>

        {/* 페이지 번호 표시 (현재 페이지와 1, 2, 3 등 추가적으로) */}
        <span className="active">{currentPage}</span>

        {/* 다음 페이지 번호, 최대 2페이지까지만 표시 */}
        {currentPage < Math.ceil(filteredPosts.length / postsPerPage) && (
          <>
            <span>{currentPage + 1}</span>
          </>
        )}

        {/* 이후 버튼 */}
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
