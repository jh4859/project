import React from 'react';


import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

let Footer = () => {

  const location = useLocation()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState("")

  useEffect(()=> {
    window.scrollTo(0,0)
  }, [location])

  // 모달 열기
  const openModal = (content) => {
    setModalOpen(true);
    setModalContent(content)
  }
  // 모달 닫기
  const closeModal = () => {
    setModalOpen(false);
  }
  const Modal = (props)=> {
    const {open, close, header, children} = props;
    return(
      <div className={open ? 'openModal modal' : "modal"}>
        {open ?(
          <section className="modal-section">
            <header className="modal-header">
              {header}
              <button className="times-close" onClick={close}>
                &times;
              </button>
            </header>
            <main className="modal-main">{children}</main>
            <footer className="modalfooter">
              <button className="modalfooter-close" onClick={close}>
                close
              </button>
            </footer>
          </section>
        ) : null}
      </div>
    )
  }

    return (
      <footer>
        <div className="footer-section">
          <div className="footer-section-sub">
            <p onClick={()=> openModal("terms")}>이용약관</p>
            <p onClick={()=> openModal("privacy")}>개인정보처리방침</p>
          </div>
        </div>

        <hr className="footer-hr"/>
        <div className="footer-section-main">
          <div className="footer-utils">
            <div className="footer-utils-icon">
              <Link to={'/'}><img src="/footer.png" alt="footer로고" /></Link>
            </div>
            <div className="footer-utils-info">
              <div className="footer-contact">
                <p>대표자 김정현 박주호 임현주</p>
                <p>등록문의 1234-5678</p>
                <p>고객센터 9876-5432</p>
              </div>
              <p>부산광역시 부산진구 양정동 353-12 타임스퀘어빌딩 6, 7층</p>
              <span>Copyright © CAFE LABORATORY. All right Reserved.</span>
            </div>

          </div>
          <div className="footer-nav">
            <div className="footer-util-navmenu">
              <p>STORE</p>
              <Link to='/cafelist'>카페정보</Link>
            </div>
            <div className="footer-util-navmenu">
              <p>COMMUNITY</p>
              <Link to='/community/notice'>공지사항</Link>
              <Link to='/community/chat'>소통창</Link>
              <Link to='/community/faq'>자주하는 질문</Link>
            </div>
            <div className="footer-util-icon">
              <a href='https://www.instagram.com/' target="_blank"><i class="fa-brands fa-instagram"></i></a>
              <a href='https://www.facebook.com/' target="_blank"><i class="fa-brands fa-square-facebook"></i></a>
              <a href='https://x.com/' target="_blank"><i class="fa-brands fa-square-x-twitter"></i></a>
            </div>
          </div>
        </div>

        <Modal open={modalOpen} close={closeModal} header={modalContent==="terms" ? "이용안내" : "개인정보저리방침"}>
          {modalContent === "terms" ? (
            <>
          개인정보수집 범위 : 이름, 연락처 <br />
          개인정보수집 및 이용목적 : 온라인 문의 및 상담 자료와 결과 회신 <br />
          * 매장과 관련된 CS의 경우, 해결 과정 안내 혹은 결과 회신을 위해 매장 관리자(슈퍼바이저,매장점주), 본사 유관부서가 연락을 드릴 수 있습니다. <br />
          <br />
          개인정보수집 및 보유기간 : 개인정보 수집 및 이용에 대한 목적이 달성되면 지체없이 파기하며 최대 보유기간은 1년을 넘기지 아니한다.
          </>
          ) : (
          <>
          카페연구소는 고객님의 개인정보를 중요시하며, 「개인정보 보호법」 및 관계 법령이 정한 바를 준수하여, 적법하게 개인정보를 처리하고 안전하게 관리하고 있습니다. <br />
          회사는 개인정보처리방침을 통하여 고객님께서 제공하시는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보 보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.
          <br /><br />
          1. 개인정보의 수집 및 이용목적 <br />
          2. 개인정보의 수집항목 <br />
          3. 개인정보 수집방법 <br />
          4. 개인정보 자동수집 장치의 설치, 운영 및 그 거부에 관한 사항 <br />
          5. 개인정보의 파기절차 및 방법 <br />
          6. 개인정보의 제 3자 제공 <br />
          7. 개인정보의 처리 위탁 <br />
          8. 만14세 미만의 아동에 대한 개인정보보호 <br />
          9. 이용자 및 법정대리인의 권리와 그 행사방법 <br />
          10. 개인정보의 기술적/관리적 보호 대책 <br />
          11. 개인정보보호책임자 및 담당부서 안내 <br />
          12. 고지의 의무 <br />
          13. 시행일자 <br />
          </>
          )}
        </Modal>
      </footer>
    );
  };

export default Footer;