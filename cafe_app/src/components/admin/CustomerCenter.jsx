import React from "react";
import "../../style/admin/MyCommunitys.css"; 

const CustomerCenter = () => {
  return (
    <div className="mypage-content">
      <div className="mypage-inquiries">
        <h2 className="mypage-h2">고객센터 문의</h2>
        <p className="customer-center-info">
          현재 고객센터는 전화 문의로만 운영되고 있습니다.
        </p>
        <p className="customer-center-phone">
          문의 전화: <strong>9876-5432</strong>
        </p>
        <p className="customer-center-hours">
          운영 시간: 평일 오전 9시 ~ 오후 6시
        </p>
      </div>
    </div>
  );
};

export default CustomerCenter;
