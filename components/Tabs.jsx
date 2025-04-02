import { useNavigate, useLocation } from "react-router-dom";

const Tabs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabList = [
    { name: '공지사항', path: '/community/notice' },
    { name: '소통창', path: '/community/chat' },
    { name: 'FAQ', path: '/community/faq' },
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
