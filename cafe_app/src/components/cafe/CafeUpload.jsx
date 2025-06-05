import { useState, useContext, useEffect } from "react";
import { CafeContext } from "../CafeProvider";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";

let CafeUpload = () => {
    let {addCafe} = useContext(CafeContext)
  
    const [imgURL, setImgURL] = useState([]);   // 이미지 URL을 저장
    const [imgName, setImgName] = useState([]); // 이미지 파일명을 저장
    const [images, setImagesFiles] = useState([]); // 이미지 파일 객체들 저장
    const [name, setName] = useState("")
    const [title, setTitle] = useState("")
    const [place, setPlace] = useState("")
    const [content, setContent] = useState("")
    const [sns, setSns] = useState("")
    const [phone, setPhone] = useState("")

    const [existingImages, setExistingImages] = useState([]); // 기존 이미지 (수정 시)
    const [imagesToDelete, setImagesToDelete] = useState([]); // 삭제할 이미지 파일명 리스트

    const [approvalStatus, setApprovalStatus] = useState("PENDING"); // 승인 상태 관리 (기본: PENDING)

    const [cafeHours, setCafeHours] = useState({
      월 : "",
      화 : "",
      수 : "",
      목 : "",
      금 : "",
      토 : "",
      일 : ""
    })

    const navigate = useNavigate()

    // 토큰 확인
    useEffect(() => {
      // 로컬 스토리지에서 토큰 가져오기
      const token = localStorage.getItem("token");
    
      if (token) {
        console.log("저장된 JWT 토큰:", token);
      } else {
        console.log("JWT 토큰이 존재하지 않습니다.");
      }

      // 로그인 시 저장된 작성자 정보 가져오기
      const nickname = localStorage.getItem("nickname");
      if (nickname) {
        setName(nickname); // '작성자' 필드에 로그인한 사용자의 ID를 설정
      } else {
        navigate("/login"); // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
      }
    }, [navigate]);
    

    // 영업일 시간 입력
    const handleCafeHoursChange = (e) => {
      const{name, value} = e.target;
      setCafeHours((prev)=>({
        ...prev,
        [name] : value
      }))
    }

    // img 업로드 (파일 선택)
    let handleImageChange = (e) => {
      let files = Array.from(e.target.files);

      e.target.value = null;
  
      if (existingImages.length + images.length + files.length > 3) {
        alert("3개의 이미지까지 선택가능합니다.");
        return;
      }
        const newImgURLs = files.map(file=> URL.createObjectURL(file))
        const newImgNames = files.map(file => file.name)

        setImagesFiles((prev) => {
          const updatedFiles = [...prev, ...files];
          setImgURL((prev) => [...prev, ...newImgURLs]);
          setImgName((prev) => [...prev, ...newImgNames]);
          return updatedFiles; // 이미지를 업데이트한 후 상태 반환
        });
    }

    // img 업로드 (파일 드래그 앤 드롭)
    let handleDrop = (e) => {
      e.preventDefault();
      let files = Array.from(e.dataTransfer.files);

      e.target.value = null;
  
      if (existingImages.length + images.length + files.length > 3) {
        alert("3개의 이미지까지 선택가능합니다.");
        return;
      }
        const newImgURLs = files.map(file=> URL.createObjectURL(file))  //blob URL 만들어서 미리보기 
        const newImgNames = files.map(file => file.name)

        setImagesFiles((prev) => {
          const updatedFiles = [...prev, ...files];
          setImgURL((prev) => [...prev, ...newImgURLs]);
          setImgName((prev) => [...prev, ...newImgNames]);
          return updatedFiles; // 이미지를 업데이트한 후 상태 반환
        });
    }

    // 이미지 파일 선택 취소 (x)
    const removeImage = (indexToRemove) => {
      if (indexToRemove < existingImages.length) {
        const removedImage = existingImages[indexToRemove];
        setImagesToDelete((prev) => [...prev, removedImage.imgName]); // 삭제할 이미지명 추가
        setExistingImages((prev) => prev.filter((_, i) => i !== indexToRemove)); // 기존 이미지도 제거!
      } else {
        const relativeIndex = indexToRemove - existingImages.length;
        setImagesFiles((prev) => prev.filter((_, i) => i !== relativeIndex));
      }

      // imgName, ImagesFiles, imgURL 상태 업데이트
      setImgName((prev) => prev.filter((_, i) => i !== indexToRemove)); // imgName에서 삭제
      setImagesFiles((prev) => prev.filter((_, i) => i !== indexToRemove)); // ImagesFiles에서 삭제
      setImgURL((prev) => prev.filter((_, i) => i !== indexToRemove)); // imgURL에서 삭제
    };


    // 주소
    const handlePostcodeSearch = () => {
    if (!window.daum || !window.daum.Postcode) {
      alert("주소 API가 아직 로드되지 않았어요. 잠시 후 다시 시도해주세요.");
      return;
    }

    new window.daum.Postcode({
      oncomplete: function (data) {
        setPlace(data.address);  // ✅ 주소만 저장
      },
    }).open();
  };


    // 카페 수정전 데이터 불러오는거
    const { id } = useParams(); // /edit/:id 이런 URL에서 가져오기
    const isEdit = Boolean(id); // id가 있으면 수정모드
    useEffect(() => {
      if (isEdit) {
        axios.get(`http://localhost:8080/api/cafe/${id}`)
          .then((res) => {
            const data = res.data;
            console.log("응답 데이터:", data);  // 응답 데이터 확인
            setName(data.name);
            setTitle(data.title);
            setPlace(data.place);
            setContent(data.content);
            setPhone(data.phone);
            setSns(data.sns);
            setCafeHours(data.cafeHours);

            setApprovalStatus(data.approvalStatus); // 승인 상태를 받아와서 설정
    
            // 이미지 URL은 서버 이미지 URL로
            setImgURL(data.imgURLs || []);
            setImgName(data.imgNames || []);

            setExistingImages(
              (data.imgNames || []).map((name, idx) => ({
                imgName: name,
                imgURL: data.imgURLs[idx]
              }))
            );
          })
          .catch((err) => {
            console.error("카페 정보 불러오기 실패", err);
          });
      }
    }, [id, isEdit]);
  
    const userId = localStorage.getItem("userid"); // 로그인된 사용자의 userId
    if (!userId) {
      alert("로그인 후 이용해주세요.");
      navigate("/login"); // 로그인 페이지로 리디렉션
      return;
    }

    console.log("User ID being sent:", userId);  // 추가 확인
    
    const handleSubmit = async (e) => {
      e.preventDefault()

      if(!name){
        alert("작성자를 입력해주세요.");
        return;
      }

      if(!title){
        alert("매장명을 입력해주세요.");
        return;
      }

      if(Object.values(cafeHours).some((hour) => !hour)){
        alert("영업일을 입력해주세요.");
        return;
      }

      if(!place){
        alert("카페 위치를 입력해주세요.");
        return;
      }

      if(!content){
        alert("내용을 50자 이내로 입력해주세요");
        return;
      }

      if(!phone){
        alert("가게연락처를 입력해주시요");
        return;
      }

      if(imgURL.length ===0){
        alert("이미지를 선택해주세요.");
        return;
      }

      // 수정 모드일 때 재승인 요청 여부 확인
      if (isEdit) {
        const shouldProceed = window.confirm("수정 시 재승인 요청됩니다. 수정하시겠습니까?");
        if (!shouldProceed) {
          return; // 수정 진행을 취소
        }
      }


      

      // FormData 방식
      // 이미지 파일을 프론트에서 서버로 업로드 → 서버에 저장 → URL을 클라이언트에 전달 → DB에 저장
      const formData = new FormData();
      formData.append("userid", userId);  // 로그인한 사용자의 ID 추가

      // 이미지 파일 첨부
      images.forEach(file => {
        formData.append("files", file);
      });

      imagesToDelete.forEach((name) => {
        formData.append("deleteImgNames", name); // 리스트로 처리
      });
      
      console.log("삭제될 이미지:", imagesToDelete);

      const cafeData = {
        name,
        title,
        place,
        content,
        sns,
        phone,
        cafeHours,
        approvalStatus : "PENDING",// 승인 상태(대기)
      };

      // JSON 문자열로 변환해 FormData에 추가
      formData.append("cafeData", JSON.stringify(cafeData));

      // 토큰 가져오기
      const token = localStorage.getItem('token');

      try {
        const url = isEdit
          ? `http://localhost:8080/api/editCafe/${id}`
          : "http://localhost:8080/api/addCafe";

      
        const method = isEdit ? "post" : "post";
        const response = await axios({
          method,
          url,
          data: formData,
          headers: {
            'Authorization': `Bearer ${token}`
          }
          // headers: {
          //   "Content-Type": "multipart/form-data"
          // }
        });
      
        const { imageUrls } = response.data;
        setImgURL(imageUrls); // 서버에서 응답 온 정적 URL로 교체
      
        if (!isEdit) {
          addCafe(imageUrls, imgName, cafeHours, title, place, content, phone, sns);
          alert("작성하신 카페정보가 승인요청되었습니다.");

          navigate("/mypage");

        } else {
          alert("카페가 재승인 요청되었습니다.");
          navigate(`/cafedetail/${id}`);  // 수정 후 디테일 페이지로 이동
        }

      } catch (error) {
        console.error("카페 등록/수정 실패", error.response);
        alert("카페 등록 중 문제가 발생했습니다.");
      }
     
    }
  
    return(
      <div className='cafeupload-board'>
        <div className="breadcrumb-list">
          <span className="breadcrumb-list-home"><i class="fa-solid fa-house"></i></span>
          <span className="breadcrumb-list-arrow">&gt;</span>
          <span className="breadcrumb-list-info">카페정보</span>
          <span className="breadcrumb-list-arrow">&gt;</span>
          <span className="breadcrumb-list-info">카페등록</span>
        </div>
        <h2>카페 등록</h2>

        <div className="upload-form-container">
          <h3>카페 정보 작성</h3>
          <form onSubmit={handleSubmit}>
            <div className="upload-form-content">
              <div className="upload-form-cafe">
                <label>작성자<span className="upload-required">*</span></label>
                <input type="text" placeholder='작성자' onChange={(e)=> setName(e.target.value)} value={name} disabled/>
              </div>
            
              <div className="upload-form-cafe">
                <label>매장명<span className="upload-required">*</span></label>
                <input type="text" placeholder='매장명을 입력해주세요' onChange={(e)=> setTitle(e.target.value)} value={title}/>
              </div>

              <div className="upload-form-cafe">
                <label>영업일<span className="upload-required">*</span></label>
                <div className="upload-cafehour">
                  {['월','화','수','목','금','토','일'].map((day,idx) =>(
                    <div key={idx} className="upload-cafehour-item">
                      <p>{day}</p>
                      <textarea type="text" placeholder='영업시간을 입력해주세요' onChange={handleCafeHoursChange}
                      value={cafeHours[day]} name={day} className="upload-cafehour-textarea"/>
                    </div>
                  ))}
                </div>
                </div>

              <div className="upload-form-address">
                <label>카페주소<span className="upload-required">*</span></label>
                <div className="upload-form-address-container">
                  <input
                    type="text"
                    value={place}
                    placeholder="주소를 검색해주세요"
                    readOnly
                    className="upload-form-address-input"
                  />
                  <button className="upload-form-address-btn" onClick={handlePostcodeSearch}>
                    주소 찾기
                  </button>
                </div>
              </div>


              <div className="upload-form-cafe">
                <label>연락처<span className="upload-required">*</span></label>
                <input type="text" placeholder='가게연락처를 입력해주세요'onChange={(e)=> setPhone(e.target.value)} value={phone}/>
              </div>

              <div className="upload-form-cafe">
                <label>SNS</label>
                <input type="text" placeholder='SNS 링크를 입력해주세요'onChange={(e)=> setSns(e.target.value)} value={sns}/>
              </div>

              <div className="upload-form-cafe">
                <label>소개글<span className="upload-required">*</span></label>
                <input type="text" placeholder='내용을 50자 이내로 입력해주세요' onChange={(e)=> setContent(e.target.value)} value={content} maxLength={50} />
              </div>

            </div>

            <div className="upload-form-img">
              <label>첨부파일<span className="upload-required">*</span></label>
              <div className="upload-form-input">
                <input type="file" accept="image/*" onChange={handleImageChange} style={{display:'none'}} id="file-upload" multiple/>

                {/* 이미지 제목표시 */}
                <div className="upload-form-filename" onDrop={handleDrop} onDragOver={(e)=> e.preventDefault()}>
                {imgName.length > 0 ? (
                  <div className="upload-file-tag-wrapper">
                    {imgName.map((name, index) => (
                      <div key={index} className="upload-file-tag">
                        <span>{name}</span>
                        <button type="button" onClick={() => removeImage(index)} className="upload-file-remove-btn">
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="upload-file-name">선택된 파일이 없습니다.</p>
                )}
                </div>
                <p className="upload-form-imgtext">*파일(jpg, jpeg, fif, gif, tif, tiff, png, zip)은 최대 3개까지 선택 가능합니다.</p>

              </div>

              {/* 이미지 선택 버튼 */}
              <button className="upload-form-img-choose" type="button" onClick={()=> document.getElementById('file-upload').click()}>파일선택</button>
            </div>


            <div className="upload-form-btn">
              <button type='submit'>{isEdit ? "게시글 수정" : "등록 승인요청"}</button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  export default CafeUpload;