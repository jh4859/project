import React, { useEffect } from 'react';

const CafeKakaoMap = ({ address }) => {
  useEffect(() => {
    console.log(window.kakao);

    // 카카오 지도 API가 로드되어 있는지 확인
    if (!window.kakao) {
      console.error("Kakao Maps API가 로드되지 않았습니다.");
      return;
    }

    if (!address) {
      console.error("주소가 제공되지 않았습니다.");
      return;
    }

    const container = document.getElementById('map');
    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울 기본 좌표
      level: 3,
    };

    const map = new window.kakao.maps.Map(container, options);

    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(address, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

        new window.kakao.maps.Marker({
          map: map,
          position: coords,
        });

        map.setCenter(coords);
      } else {
        console.log("주소 검색 실패 🥲", address);
      }
    });
  }, [address]);

  return (
    <div
      id="map"
      style={{
        width: '100%',
        height: '300px',
        border: '1px solid #ccc',
        borderRadius: '12px',
        marginTop: '10px',
      }}
    ></div>
  );
};

export default CafeKakaoMap;
