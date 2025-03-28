import { useNavigate, useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { CafeContext } from "../CafeProvider";

function DetailBoard() {
    const { posts, addComment } = useContext(CafeContext);  
    const { postId } = useParams();
    const navigate = useNavigate();
    const [comment, setComment] = useState("");
    const [fileURL, setFileURL] = useState(null);  // 파일 미리보기용 URL

    const post = posts.find((p) => p.id === parseInt(postId));

    useEffect(() => {
        // post가 있고, 파일이 존재할 경우, 미리보기 URL 생성
        if (post?.file) {
            const url = URL.createObjectURL(post.file);
            setFileURL(url);

            // 메모리 누수 방지를 위해 언마운트 시 해제
            return () => URL.revokeObjectURL(url);
        }
    }, [post]);

    if (!post) {
        return <div>게시물이 없습니다.</div>;
    }

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (comment.trim()) {
            addComment(postId, comment); 
            setComment(""); 
        }
    };

    const handleClick = () => {
        navigate("/community");
    };

    return (
        <>
            <div className="main-container">
                <div className="title-section">
                    <div className="title">
                    <h2>{post.title}</h2>
                    </div>
                    <div className="info">
                    <span>작성자: 관리자</span>
                    <span>작성일: {post.createDate}</span>
                    </div>
                </div>

                <div className="attached-file">
                    {post.file && post.file.type.startsWith("image/") && (
                    <div className="file-preview">
                        <img src={fileURL} alt="첨부 이미지" />
                    </div>
                    )}
                </div>

                <div className="content">
                    <p>{post.content}</p>
                </div>

                <div className="list-btn">
                    <button onClick={handleClick}>목록</button>
                </div>

                <div className="attached-file">
                    {post.file && !post.file.type.startsWith("image/") && (
                        <div className="file-preview">
                            <p>
                                첨부파일:{" "}<a href={fileURL} download={post.file.name} className="download-link">{post.file.name}</a>
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="comment-section">
                <div className="add-comment">
                    <h4>댓글쓰기</h4>
                    <div className="write-section">
                        <form onSubmit={handleCommentSubmit}>
                            <div className="write-comment">
                                <textarea id="comment" name="comment" placeholder="댓글을 입력해주세요." value={comment} onChange={handleCommentChange} required/>
                            </div>
                            <div className="write-btn">
                                <button type="submit">등록</button>
                            </div>
                        </form>
                    </div> 
                </div>

                <div className="commentlist">
                    <h4>댓글</h4>
                    <div className="commentlist-section">
                        {(post.comments || []).map((comment, index) => (
                            <div className="comments" key={index}>
                                <span>{comment.author}: </span>
                                <p>{comment.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default DetailBoard;
