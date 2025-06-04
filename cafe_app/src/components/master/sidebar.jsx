import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import '../../style/master/sidebar.css'

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [openMenu, setOpenMenu] = useState({
        member: false,
        board: false
    });

    useEffect(() => {
        setOpenMenu({
            member: location.pathname.includes("/admin/list"),
            board: location.pathname.includes("/admin/Bord"),
        });
    }, [location]);

    const toggleMenu = (menu) => {
        setOpenMenu((prev) => ({
            ...prev,
            [menu]: !prev[menu],
        }));
    };

    const logoutCheck = () => {
        const confirmLogout = window.confirm("로그아웃 하시겠습니까?");
        if (confirmLogout) {
            // ✅ localStorage에서 로그인 정보 삭제
            localStorage.removeItem("token");
            localStorage.removeItem("userid");
            localStorage.removeItem("userType");
        
            alert("로그아웃 되었습니다.");
            navigate("/"); // 메인 페이지로 이동
          }
    };

    return (
        <>
            {/* 사이드바 */}
            <div className="sidebar-tap">
                <h2 className="sidebar-h2">
                    관리자 메뉴
                    <Link to="/" className="sidebar_Link">
                        <FontAwesomeIcon icon={faHouse} className="sidebar-icon" />
                    </Link>
                </h2>
                <ul className="sidebar-ul">
                <li>
                    <div className="sidebar-item">
                        <a href="/admin/dash">대시보드</a>
                    </div>
                </li>

                    {/* 회원 관리 드롭다운 */}
                    <li>
                        <div className="sidebar-item" onClick={() => toggleMenu("member")}>
                            회원 관리
                        </div>

                        {openMenu.member && (
                            <ul className="dropdown-list">
                                <li><a href="/admin/list/0" className="dropdown-list-a"> - 일반회원 목록</a></li>
                                <li><a href="/admin/list/1" className="dropdown-list-a"> - 카페점주 목록</a></li>
                                <li><a href="/admin/list/3" className="dropdown-list-a"> - 관리자 목록</a></li>
                            </ul>
                        )}
                    </li>

                    {/* 게시판 관리 드롭다운 */}
                    <li>
                        <div className="sidebar-item" onClick={() => toggleMenu("board")}>
                            게시판 관리
                        </div>
                        {openMenu.board && (
                            <ul className="dropdown-list">
                                <li> <a href="/admin/Bord/1" className="dropdown-list-a"> - 공지사항 목록</a></li>
                                <li><a href="/admin/Bord/3" className="dropdown-list-a">- 소통창 목록</a></li>
                                <li ><a href="/admin/Bord/2" className="dropdown-list-a">- 자주 묻는 질문 목록</a></li>
                                <li><a href="/admin/Bord/4" className="dropdown-list-a">- 카페등록 목록</a></li>
                            </ul>
                        )}
                    </li>

                    <li>
                        <div className="sidebar-item">
                            <a href="/admin/dash">설정</a>
                        </div>
                    </li>
                    <li className="sidebar-logout">
                        <button className="sidebar-logout-btn" onClick={logoutCheck}>로그아웃</button>
                    </li>
                </ul>
                {/* <div className="downlogo">
                    <img src={flogo} alt="로고" />
                </div> */}
            </div>
        </>
    );
};

export default Sidebar;

