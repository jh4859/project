import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CafeContext } from "../CafeProvider";
import Tabs from "./Tabs";

const CommunityPage = () => {
  const { posts } = useContext(CafeContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('title');
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(10);
  const navigate = useNavigate();
  
  const sortedPosts = filteredPosts.sort((a, b) => b.id - a.id);

  const handleClick = () => {
    navigate("/community/:category/add"); // 글쓰기 페이지로 이동
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSearchCategory(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    let filtered = posts.filter((post) =>
      post[searchCategory].toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered);
    setCurrentPage(1); // Reset to the first page after search
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(filteredPosts.length / postsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="community-container">
      <Tabs />
      <div className="tab-content">
        <div className="notice-board">
          <div className="notice-top">
            <div className="notice-title">
              <h2>공지사항</h2>  
            </div>
            <div className="search-box">
              <form onSubmit={handleSearchSubmit}>
                <select value={searchCategory} onChange={handleCategoryChange}>
                  <option value="title">제목</option>
                  <option value="author">작성자</option>
                </select>
                <input type="search" placeholder="내용을 입력해주세요." value={searchTerm} onChange={handleSearchTermChange}/>
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
                currentPosts.map((p, idx) => (
                  <tr key={idx}>
                    <td>{p.id}</td>
                    <td onClick={() => navigate(`/community/:category/${p.id}`)} style={{ cursor: "pointer" }}>
                      <strong>{p.title}</strong>
                    </td>
                    <td>관리자</td>
                    <td>{p.createDate}</td>
                    <td>10</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="button-section">
        <div className="add-button">
          <button onClick={handleClick}>글쓰기</button>
        </div>
      </div>

      <div className="pagination">
        <button className="prev-btn" onClick={handlePrevPage}>이전</button>
        <span className="active">{currentPage}</span>
        <button className="next-btn" onClick={handleNextPage}>이후</button>
      </div>
    </div>
  );
};

export default CommunityPage;
