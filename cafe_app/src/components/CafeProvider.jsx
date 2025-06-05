import React from 'react';  // React import 추가


import { createContext, useState, useEffect } from "react";

export let CafeContext = createContext()

let CafeProvider = ({children}) => {
  const [cafes, setCafes] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredData, setFilteredData] = useState(cafes)

  // 카페 추가
  function addCafe(imgURL, imgName, cafeHours, title, place, content, phone, sns){
    let newPost = {id: Date.now(), imgURL, imgName, cafeHours, title, place, content, phone, sns}
    setCafes(prevCafes => [...prevCafes, newPost]);
    setFilteredData(prevData => [...prevData, newPost]);
  }

  // 카페 상태 저장
  useEffect(()=> {
    localStorage.setItem("cafes", JSON.stringify(cafes))
  }, [cafes])

  // 카페 상태 가져오는 (페이지가 처음 로드될 때 localStorage에 저장된 데이터를 불러오기 위한 용도)
  useEffect(()=> {
    let savedCafe = JSON.parse(localStorage.getItem("cafes"))
    if(savedCafe){
      setCafes(savedCafe)  
      setFilteredData(savedCafe)
    }
    
  }, [])

  // 클릭시 검색 초기화
  const handleResetFilter = ()=> {
    setSearchTerm("");
    setFilteredData(cafes);
  }

  // 카페 배열 변경될때마다 저장
  useEffect(()=> {
    if(cafes.length>0){
      localStorage.setItem("cafes", JSON.stringify(cafes))
    }
  }, [cafes])

  // 카페 삭제
  function deleteCafe(id){
    let filteredCafes = cafes.filter((p)=> p.id !== id)
    setCafes(filteredCafes)
    setFilteredData(filteredCafes)
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
    <CafeContext.Provider value={{cafes, setCafes, addCafe, deleteCafe, setCafes, searchTerm, filteredData, setSearchTerm, setFilteredData, handleResetFilter, posts, setPosts, addBoard, deletePost, addComment}}>
      {children}
    </CafeContext.Provider>
  )
}

export default CafeProvider;