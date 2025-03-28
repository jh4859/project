import { createContext, useState, useEffect } from "react";

export let CafeContext = createContext();

let CafeProvider = ({ children }) => {
  const [cafes, setCafes] = useState([]);
  const [posts, setPosts] = useState([]);
  const [nextId, setNextId] = useState(1);

  // 카페 추가
  function addCafe(imgURL, imgName, work, title, place, content) {
    let newPost = { id: Date.now(), imgURL, imgName, work, title, place, content };
    setCafes([...cafes, newPost]);
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
    const filteredCafes = cafes.filter((p) => p.id !== id);
    setCafes(filteredCafes);
  }
  
  /* ---------------------------------------------------------------------------------------------------------------------- */

   // 게시물 추가
   function addBoard(title, content, file) {
    const newPost = {title, content, file, id: nextId, createDate: new Date().toLocaleDateString(), comments: []};
    setNextId(nextId + 1);
    setPosts([...posts, newPost]);
  }

  //게시물 번호
  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  // 게시물 상태 저장
  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts)); // key, value
  }, [posts]);

  // 게시물 상태 가져오기
  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem("posts"));
    if (savedPosts) {
      setPosts(savedPosts); // posts가 null이 아니면 상태를 업데이트
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


  return (
    <CafeContext.Provider value={{ cafes, addCafe, deleteCafe, posts, addBoard, deletePost, addComment}}>
      {children}
    </CafeContext.Provider>
  );
};

export default CafeProvider;
