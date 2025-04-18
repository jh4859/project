import { useNavigate, useLocation } from "react-router-dom";
import React from 'react'; // ✅ 꼭 필요

const Tabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabList = [
    { name: '공지사항', path: '/notice' },
    { name: '소통창', path: '/chat' },
    { name: '자주하는 질문', path: '/faq' },
  ];

  return (
    <div className="tab-menu">
      <div className="menu-section">
        {tabList.map((tab) => (
          <button
            key={tab.name}
            onClick={() => navigate(tab.path)}
            className={location.pathname.startsWith(tab.path) ? 'active' : ''}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <hr className="community-hr" />
    </div>
  );
};

export default Tabs;
