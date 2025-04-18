import React from 'react';
import { useParams } from 'react-router-dom';
import NoticePage from './NoticePage';
import ChatPage from './ChatPage';
import FaqPage from './FaqPage';

function BoardPage() {
  const { category } = useParams();

  if (category === 'notice') return <NoticePage />;
  if (category === 'chat') return <ChatPage />;
  if (category === 'faq') return <FaqPage />;

  return <div>존재하지 않는 게시판입니다.</div>;
}

export default BoardPage;
