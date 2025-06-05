import React, { useContext, useState, useEffect } from 'react';
import axios from "axios";
import { CafeContext } from "../CafeProvider";
import { Link } from "react-router-dom";

let CafeList = () => {
  let { cafes, setCafes, searchTerm, setSearchTerm, filteredData, setFilteredData } = useContext(CafeContext);
  const [scrollTop, setScrollTop] = useState(false);
  const [numofRows, setNumOfRows] = useState(6);

  // 카페 DB에서 승인된 카페만 가져오기
  useEffect(() => {
    axios.get("http://localhost:8080/api/cafes")
      .then(res => {
        const approvedCafes = res.data.filter(cafe => cafe.approvalStatus === "APPROVED");
        setCafes(approvedCafes); // 승인된 카페만 상태에 저장
        setFilteredData(approvedCafes); // 필터링된 데이터 설정
      })
      .catch(err => {
        console.error("카페 데이터 불러오기 실패:", err);
      });
  }, [setCafes, setFilteredData]);

  // 더보기 기능
  const loadMore = () => {
    setNumOfRows(prevNum => prevNum + 6);
  };

  // 스크롤 상태 체크
  const handleScroll = () => {
    if (window.scrollY > 300) {
      setScrollTop(true);
    } else {
      setScrollTop(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 맨 위로 스크롤
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // 검색 기능
  const handleSearch = () => {
    if (searchTerm) {
      const filtered = cafes.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered); // 필터링된 데이터 설정
    } else {
      setFilteredData(cafes); // 검색어가 없으면 전체 카페 표시
    }
  };

  // 검색 초기화
  const handleResetFilter = () => {
    setSearchTerm(""); // 검색어 초기화
    setFilteredData(cafes); // 전체 카페 표시
  };

  // 카페 승인 상태 변경 시 필터링 재적용
  useEffect(() => {
    const approvedCafes = cafes.filter(cafe => cafe.approvalStatus === "APPROVED");
    setFilteredData(approvedCafes);
  }, [cafes, setFilteredData]);

  return (
    <>
      <div className="cafe-search">
        <div className="cafelist-top">
          <div className="breadcrumb-list">
            <span className="breadcrumb-list-home"><i className="fa-solid fa-house"></i></span>
            <span className="breadcrumb-list-arrow">&gt;</span>
            <span className="breadcrumb-list-info">카페정보</span>
          </div>
          <h2>
            <Link to={'/cafelist'} onClick={handleResetFilter}>CAFE LISTINGS</Link>
          </h2>
          <div className="cafe-btn">
            <div className="cafe-search-cotainer">
              <input
                type="text"
                placeholder='매장명을 입력하세요.'
                className='cafesearch-input'
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
              />
              <button className='search-btn' onClick={handleSearch}>검색</button>
            </div>
          </div>
        </div>
      </div>

      <div className="cafelist-info">
        <div className="cafe-list">
          {filteredData.length === 0 ? (
            searchTerm === "" ? (
              <p>카페 정보가 없습니다.</p>
            ) : (
              <p>검색된 카페 정보가 없습니다.</p>
            )
          ) : (
            filteredData
              .map((p, idx) => {
                if (idx < numofRows) {
                  return (
                    <div key={idx} className="cafe-item">
                      <div className="cafe-item-img">
                        <Link to={`/cafedetail/${p.id}`}>
                          <p>
                            <img
                              src={p.imgURLs && p.imgURLs.length > 0 ? p.imgURLs[0] : "/default-image.jpg"}
                              alt={p.title}
                            />
                          </p>
                        </Link>
                      </div>
                      <div className="cafe-item-text">
                        <h3>{p.title}</h3>
                        <p>{p.content}</p>
                        <div className="cafe-item-detail">
                          <Link to={`/cafedetail/${p.id}`}>
                            <p>자세히 보기+</p>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })
          )}
        </div>
        {filteredData.length > numofRows && (
          <button onClick={loadMore}>더보기</button>
        )}
      </div>

      {scrollTop && (
        <button className='scroll-to-top' onClick={scrollToTop}>
          <i className="fa-solid fa-chevron-up"></i>
        </button>
      )}
    </>
  );
};

export default CafeList;
