import React from 'react';

function LightboxImageViewer({ imageUrl, onClose }) {
  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={e => e.stopPropagation()}>
        <img src={imageUrl} alt="확대 보기" />
        <button className="close-btn" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}

export default LightboxImageViewer;
