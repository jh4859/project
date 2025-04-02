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

  const filteredPosts = posts
    .filter((post) => post.category === "faq") // 💡 카테고리 고정 필터링
    .filter((post) =>
      post[searchCategory]?.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const sortedPosts = filteredPosts.sort((a, b) => b.id - a.id);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handleClick = () => {
    navigate(`/community/faq/add`);
  };

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
              <h2>자주묻는질문</h2>
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
                    <td>{(currentPage - 1) * postsPerPage + index + 1}</td> {/* 각 페이지마다 번호 계산 */}
                    <td
                      onClick={() => navigate(`/community/faq/${p.id}`)}
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
        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>이전</button>
        <span className="active">{currentPage}</span>
        <button
          onClick={() =>
            setCurrentPage((p) =>
              p < Math.ceil(filteredPosts.length / postsPerPage) ? p + 1 : p
            )
          }
        >
          이후
        </button>
      </div>
    </div>
  );
};

export default NoticePage;
