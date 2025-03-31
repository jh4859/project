import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CafeContext } from "../CafeProvider";
import Tabs from "./Tabs";

const CommunityPage = () => {
  let { posts } = useContext(CafeContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState('title');
  const navigate = useNavigate();
  const sortedPosts = posts.sort((a, b) => b.id - a.id);

  const handleClick = () => {
    navigate("/write"); // 글쓰기 페이지로 이동
  };

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event) => {
    setSearchCategory(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // 검색 로직을 여기 구현
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
                  {posts.length === 0 ? (
                    <tr>
                      <td colSpan="5">게시글이 없습니다.</td>
                    </tr>
                  ) : (
                    sortedPosts.map((p, idx) => (
                      <tr key={idx}>
                        <td>{p.id}</td>
                        <td onClick={() => navigate(`/community/${p.id}`)}style={{ cursor: "pointer" }}>
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
        <button id="prev-page" className="prev-btn">이전</button>
        <span className="active">1</span>
        <span>2</span>
        <span>3</span>
        <button id="next-page" className="next-btn">이후</button>
      </div>
    </div>
  );
};

export default CommunityPage;
