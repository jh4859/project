import { useNavigate, useLocation } from "react-router-dom";
import React from 'react'; // ✅ 꼭 필요

const Tabs = ({ activeCategory }) => {
  const navigate = useNavigate();

  const tabList = [
    { name: "공지사항", path: "/notice", category: "notice" },
    { name: "소통창", path: "/chat", category: "chat" },
    { name: "자주하는 질문", path: "/faq", category: "faq" },
  ];

  return (
    <div className="tab-menu">
      <div className="menu-section">
        {tabList.map((tab) => (
          <button
            key={tab.name}
            onClick={() => navigate(tab.path)}
            className={activeCategory === tab.category ? "active" : ""}
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