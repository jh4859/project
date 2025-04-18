import { createContext, useState, useEffect } from "react";
import React from 'react'; // ✅ 꼭 필요


export let CafeContext = createContext();

let CafeProvider = ({ children }) => {
  const [cafes, setCafes] = useState([]);


  // 카페 추가
  function addCafe(imgURL, imgName, work, title, place, content) {
    let newCafe = { id: Date.now(), imgURL, imgName, work, title, place, content };
    setCafes(prevCafes => [...prevCafes, newCafe]);
  }

  // 카페 상태 저장
  useEffect(() => {
    localStorage.setItem("cafes", JSON.stringify(cafes));
  }, [cafes]);

  // 카페 상태 가져오기
  useEffect(() => {
    const savedCafe = JSON.parse(localStorage.getItem("cafes"));
    if (savedCafe) {
      setCafes(savedCafe);
    }
  }, []);

  // 카페 삭제
  function deleteCafe(id) {
    setCafes(prevCafes => prevCafes.filter(cafe => cafe.id !== id));
  }

  /* ---------------------------------------------------------------------------------------------------------------------- */

const [posts, setPosts] = useState([]);
const [nextId, setNextId] = useState(1);

  // 게시물 추가
function addBoard(title, content, files, category) {
  const newPost = {
    title,
    content,
    files: files.map(file => ({ url: URL.createObjectURL(file) })), // 저장할 때는 URL만 저장
    category,
    id: nextId,
    createDate: new Date().toISOString(),
    comments: [],
  };
  const categoryPosts = posts.filter(post => post.category === category);
  setNextId(nextId + 1);
  setPosts([...posts, newPost]);
}

// 게시물 상태 가져오기
useEffect(() => {
  const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];

  setPosts(savedPosts);
  const lastPost = savedPosts[savedPosts.length - 1];
  setNextId(lastPost ? lastPost.id + 1 : 1); // 빈 배열일 경우 대비
}, []);

//게시물 번호
useEffect(() => {
  localStorage.setItem("posts", JSON.stringify(posts));
}, [posts]);

// 게시물 상태 저장
useEffect(() => {
  localStorage.setItem("posts", JSON.stringify(posts));
}, [posts]);

// 게시물 상태 가져오기
useEffect(() => {
  const savedPosts = JSON.parse(localStorage.getItem("posts"));
  if (savedPosts) {
    setPosts(savedPosts);
  }
}, []);

// 게시물 삭제
function deletePost(id) {
  const filteredPosts = posts.filter((p) => p.id !== id);
  setPosts(filteredPosts);
}

//상세보기 댓글 가져오기
const addComment = (postId, text) => {
  setPosts(prevPosts =>
    prevPosts.map(post =>
      post.id === parseInt(postId)
        ? {
            ...post,
            comments: [
              ...post.comments,
              {
                author: "사용자", // 또는 로그인 사용자 이름
                text,
              },
            ],
          }
        : post
    )
  );
};



return(
  <CafeContext.Provider value={{cafes, setCafes, addCafe, deleteCafe, setCafes, posts, setPosts, addBoard, deletePost, addComment}}>
    {children}
  </CafeContext.Provider>
)
}

export default CafeProvider;
