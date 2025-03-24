import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('공지사항');

  return (
    <div className="community-container">
      <div className="tab-menu">
        <button
          className={activeTab === '공지사항' ? 'active' : ''}
          onClick={() => setActiveTab('공지사항')}
        >
          공지사항
        </button>
        <button
          className={activeTab === '소통창' ? 'active' : ''}
          onClick={() => setActiveTab('소통창')}
        >
          소통창
        </button>
        <button
          className={activeTab === 'FAQ' ? 'active' : ''}
          onClick={() => setActiveTab('FAQ')}
        >
          FAQ
        </button>
      </div>

      <div className="tab-content">
        {activeTab === '공지사항' && (
          <div className="notice-board">
            <div className="search-box-section">
                <div className="search-box">
                    <form action="search">
                        <input type="search" placeholder="검색어를 입력해주세요."/>
                        <button>검색</button>
                    </form>
                </div>
            </div>
            
            <h2>공지사항</h2>
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
                        <tr>
                            <td>10</td>
                            <td><a href="#"><strong>공지사항입니다. 확인해 주세요.</strong></a></td>
                            <td>관리자</td>
                            <td>2025.03.18</td>
                            <td>10</td>
                        </tr>
                        <tr>
                            <td>9</td>
                            <td><a href="#"><strong>공지사항입니다. 확인해 주세요.</strong></a></td>
                            <td>관리자</td>
                            <td>2025.03.18</td>
                            <td>10</td>
                        </tr>
                        <tr>
                            <td>8</td>
                            <td><a href="#"><strong>공지사항입니다. 확인해 주세요.</strong></a></td>
                            <td>관리자</td>
                            <td>2025.03.18</td>
                            <td>10</td>
                        </tr>
                        <tr>
                            <td>7</td>
                            <td><a href="#"><strong>공지사항입니다. 확인해 주세요.</strong></a></td>
                            <td>관리자</td>
                            <td>2025.03.18</td>
                            <td>10</td>
                        </tr>
                        <tr>
                            <td>6</td>
                            <td><a href="#"><strong>공지사항입니다. 확인해 주세요.</strong></a></td>
                            <td>관리자</td>
                            <td>2025.03.18</td>
                            <td>10</td>
                        </tr>
                        <tr>
                            <td>5</td>
                            <td><a href="#"><strong>공지사항입니다. 확인해 주세요.</strong></a></td>
                            <td>관리자</td>
                            <td>2025.03.18</td>
                            <td>10</td>
                        </tr>
                        <tr>
                            <td>4</td>
                            <td><a href="#"><strong>공지사항입니다. 확인해 주세요.</strong></a></td>
                            <td>관리자</td>
                            <td>2025.03.18</td>
                            <td>10</td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td><a href="#"><strong>공지사항입니다. 확인해 주세요.</strong></a></td>
                            <td>관리자</td>
                            <td>2025.03.18</td>
                            <td>10</td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td><a href="#"><strong>공지사항입니다. 확인해 주세요.</strong></a></td>
                            <td>관리자</td>
                            <td>2025.03.18</td>
                            <td>10</td>
                        </tr>
                        <tr>
                            <td>1</td>
                            <td><a href="#"><strong>공지사항입니다. 확인해 주세요.</strong></a></td>
                            <td>관리자</td>
                            <td>2025.03.18</td>
                            <td>10</td>
                        </tr>
                  </tbody>
              </table> 
          </div>
        )}

        {activeTab === '소통창' && (
          <div>
            <h2>소통창</h2>
            <p>소통하는 공간입니다.</p>
          </div>
        )}

        {activeTab === 'FAQ' && (
          <div>
            <h2>FAQ</h2>
            <p>자주 묻는 질문을 확인해보세요.</p>
          </div>
        )}
      </div>
      
      <div className="button-section">
        <div className="add-button">
            <button>
              글쓰기
            </button>
        </div>
      </div>

        <div class="pagination">
          <button id="prev-page" class="prev-btn">이전</button>
          <span class="active">1</span>
          <span>2</span>
          <span>3</span>
          <button id="next-page" class="next-btn">이후</button>
        </div>
    </div>
  );
};

export default CommunityPage;
