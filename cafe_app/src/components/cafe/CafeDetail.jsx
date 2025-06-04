import React from 'react';
import axios from "axios";

import { useContext, useEffect, useState } from "react";
import { CafeContext } from "../CafeProvider";
import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import CafeKakaoMap from "./CafeKakaoMap";

let CafeDetail = () => {
    const[mainImage, setMainImage] = useState(null);
    const navigate = useNavigate();
    
    const { cafes, setCafes, setFilteredData } = useContext(CafeContext)
    let { id } = useParams()
    const [selectedCafe, setSelectedCafe] = useState(null);

    const today = new Date().toLocaleDateString('ko-KR', { weekday: 'long' }).slice(0, 1);          // 오늘 요일
    const dayOrder = ['월', '화', '수', '목', '금', '토', '일'];                    // 요일 순서 지정
    
    useEffect(() => {
        axios.get("http://localhost:8080/api/cafes")
          .then((res) => {
            const found = res.data.find(c => c.id === parseInt(id));
            setSelectedCafe(found);
            setCafes(res.data);
            setFilteredData(res.data);
          })
          .catch(err => {
            console.error("카페 데이터 가져오기 실패:", err);
          });
      }, [id]);

    // mainimage는 첫번째 이미지로 설정
    useEffect(() => {
        if (selectedCafe?.imgURLs?.length > 0) {
          setMainImage(selectedCafe.imgURLs[0]);
        }
      }, [selectedCafe]);

    if (!selectedCafe) {return <div>카페 정보를 불러오는 중입니다...</div>}
    

    const handleImageClick = (imgURL) => {
        setMainImage(imgURL)
    }


    return(
      <>
      <div className="cafedetail-board">
        {/* <h3>{p.title}</h3> */}
        <hr className="cafe-detail-first-hr"/>
        <div className="breadcrumb-list">
            <span className="breadcrumb-list-home"><i class="fa-solid fa-house"></i></span>
            <span className="breadcrumb-list-arrow">&gt;</span>
            <span className="breadcrumb-list-info">카페정보</span>
            <span className="breadcrumb-list-arrow">&gt;</span>
            <span className="breadcrumb-list-info">{selectedCafe.title}</span>
        </div>
            <div className='cafe-detail'>
                <div className="cafe-detail-left">
                    {/* 큰 이미지 */}
                    <div className="cafe-detail-mainimg">
                        <img src={mainImage} alt={selectedCafe.imgNames[0]}/>
                    </div>
                    {/* 서브 이미지 */}
                    {selectedCafe.imgURLs.length >1 && (
                        <div className="cafe-detail-subimg">
                            {selectedCafe.imgURLs.map((imgURL,idx) => (
                                <img key={idx} src={imgURL} alt={selectedCafe.imgNames[idx]} onClick={()=> handleImageClick(imgURL)}/>
                            ))}
                        </div>
                    )}
                </div>
                <div className="cafe-detail-right">
                    <h1>{selectedCafe.title}</h1>
                    <p>{selectedCafe.content}</p>
                    
                    <hr className="cafe-detail-hr"/>

                    <div className="cafe-detail-item">
                        <p>영업일</p>
                        <ul>
                            {dayOrder.map(day => {
                                const hours = selectedCafe.cafeHours[day];
                                if (!hours) return null;
                                const isToday = day === today;
                                return(
                                    <li key={day} style={isToday ? { fontWeight: 'bold' } : {}} className='cafe-detail-item-time'>
                                        <span className='cafe-detail-day'>{day}</span>  
                                        <span className='cafe-detail-hours'>{hours}</span>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                    <hr className="cafe-detail-hr"/>
                    <div className="cafe-detail-item">
                        <p>카페위치</p>
                        <span>{selectedCafe.place}</span>
                    </div>
                    <hr className="cafe-detail-hr"/>
                    <div className="cafe-detail-item">
                        <p>지도</p>
                        <CafeKakaoMap address={selectedCafe.place}/>
                    </div>
                    <hr className="cafe-detail-hr"/>
                    <div className="cafe-detail-item">
                        <p>연락처</p>
                        <span>{selectedCafe.phone}</span>
                    </div>
                    <hr className="cafe-detail-hr"/>
                    <div className="cafe-detail-item">
                        <p>SNS</p>
                        {selectedCafe.sns && (                              
                        <a href={selectedCafe.sns} target="_blank" rel="noopener noreferrer" className='cafe-detail-item-sns'>       
                            <span>{selectedCafe.sns}</span>                         {/* noopener 보안 이슈 방지용*/}
                        </a>
                        )}
                    </div>
                </div>
            </div>
            <div className="cafedetail-btn">
                <Link to={'/cafelist'}>
                    <button>목록</button>
                </Link>
            </div>
      </div>
      </>
    )
  }

  export default CafeDetail;