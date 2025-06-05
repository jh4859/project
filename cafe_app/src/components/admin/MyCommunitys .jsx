import React, { useState, useEffect, useParams } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate import
import "../../style/admin/MyCommunitys.css"; 
import axios from "axios";

const MyCommunitys = () => {
  const [myPosts, setMyPosts] = useState([]);
  const [myComments, setMyComments] = useState([]);

  const token = localStorage.getItem("token");
  const nickname = localStorage.getItem("nickname");

  const navigate = useNavigate(); // navigate 훅 사용

  // 작성 시간 통일
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // 내가 쓴 글 가져오기
  useEffect(() => {
    axios.get("/api/board", {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      console.log("전체 글 데이터:", res.data);
      const myPosts = res.data.filter(post => post.nickname === nickname);
      setMyPosts(myPosts);
    })
    .catch((err) => {
      console.error("게시글 불러오기 실패", err);
    });
  }, [token, nickname]);

  // 내가 쓴 댓글 가져오기
  useEffect(() => {
    if (!nickname || !token) {
      console.log("nickname 또는 token이 없음:", nickname, token);
      return;
    }

    axios.get("/api/comments/user", {
      params: { nickname },
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      console.log("내 댓글 목록:", res.data);
      setMyComments(res.data);
    })
    .catch((err) => {
      console.error("내 댓글 불러오기 실패", err);
    });
  }, [nickname, token]);

  // 게시글 상세보기로 새 창으로 이동
  const handlePostDetail = (postId) => {
    window.open(`/chat/${postId}`, "_blank"); // 새 창에서 게시글 상세보기 페이지로 이동
  };

  // 댓글 상세보기로 새 창으로 이동
  const handleCommentDetail = (postId) => {
    window.open(`/chat/${postId}`, "_blank"); // 새 창에서 댓글이 속한 게시글 상세보기 페이지로 이동
  };

  // 게시글 수정 함수
  const handleEditPost = (category, postId) => {
    navigate(`/edit/${category}/${postId}`);
  };


  // 게시글 삭제 함수
  const handleDeletePost = async (postId, category) => {
    const confirmDelete = window.confirm("정말로 게시글을 삭제하시겠습니까?");
    if (confirmDelete) {
      try {
        await axios.delete(`/api/board/${category}/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert("게시글이 삭제되었습니다.");
        // 삭제된 게시글을 상태에서 제거
        setMyPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      } catch (err) {
        console.error("게시글 삭제 실패:", err);
        alert("게시글 삭제 중 오류가 발생했습니다.");
      }
    }
  };


  // 댓글 삭제 함수
  const handleCommentDelete = (commentId) => {
    const confirmed = window.confirm("댓글을 삭제하시겠습니까?");
    if (!confirmed) return;

    axios.delete(`/api/comments/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then(() => {
      alert("댓글이 삭제되었습니다.");
      setMyComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
    })
    .catch((err) => {
      console.error("댓글 삭제 실패", err);
      alert("댓글 삭제에 실패했습니다.");
    });
  };


  return (
    <>
    <div className="mypage-content">
      <h2 className="mypage-h2">내가 쓴 게시글</h2>
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성일</th>
            <th>상세보기</th>
            <th>비고</th>
          </tr>
        </thead>
        <tbody>
          {myPosts.length === 0 ? (
            <tr>
              <td colSpan="5">작성하신 게시글이 없습니다.</td>
            </tr>
          ) : (
            myPosts.map((post, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{post.title}</td>
                <td>{formatDate(post.createDate)}</td>
                <td>
                  <button onClick={() => handlePostDetail(post.id)} className="mycommunity-showbtn">상세보기</button>
                </td>
                <td>
                  <button className="mycommunity-editbtn" onClick={() => handleEditPost(post.category, post.id)}>수정</button>
                  <button onClick={() => handleDeletePost(post.id, post.category)} className='mycommunity-deletebtn'>삭제</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
      
    <div className="mypage-comment">
      <h2 className="mypage-h2">내가 쓴 댓글</h2>
      <table>
        <thead>
          <tr>
            <th>번호</th>
            <th>댓글 내용</th>
            <th>작성일</th>
            <th>상세보기</th>
            <th>비고</th>
          </tr>
        </thead>
        <tbody>
          {myComments.length === 0 ? (
            <tr>
              <td colSpan="5">작성하신 댓글이 없습니다.</td>
            </tr>
          ) : (
            myComments.map((comment, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{comment.comment}</td>
                <td>{formatDate(comment.createdAt)}</td>
                <td>
                  <button onClick={() => handleCommentDetail(comment.postId)} className="mycommunity-showbtn">상세보기</button>
                </td>
                <td>
                  {/* <button className="mycommunity-editbtn">수정</button> */}
                  <button onClick={() => handleCommentDelete(comment.id)} className='mycommunity-deletebtn'>삭제</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
    </>
  );
};

export default MyCommunitys;
