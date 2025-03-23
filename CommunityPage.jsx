import React, { useState } from 'react';

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState('공지사항');

  const noticePosts = [
    { id: 1, title: '📢 [공지] 매장 리뉴얼 안내', date: '2025-03-20' },
    { id: 2, title: '🎉 봄 신메뉴 출시!', date: '2025-03-15' },
    { id: 3, title: '📆 영업시간 변경 안내', date: '2025-03-10' },
  ];

  return (
    <div className="community-container">
      {/* 탭 메뉴 */}
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

      {/* 탭 내용 */}
      <div className="tab-content">
        {activeTab === '공지사항' && (
          <div className="notice-board">
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
    </div>
  );
};

export default CommunityPage;
