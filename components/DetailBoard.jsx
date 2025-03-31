import { useNavigate, useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { CafeContext } from "../CafeProvider";
import Tabs from "../components/Tabs";

function DetailBoard() {
    const { posts, addComment } = useContext(CafeContext);  
    const { postId } = useParams();
    const navigate = useNavigate();
    const [comment, setComment] = useState("");
    const [fileURLs, setFileURLs] = useState([]); // 여러 파일 URL
    const [activeTab, setActiveTab] = useState('공지사항');

    const post = posts.find((p) => p.id === parseInt(postId));

    useEffect(() => {
        if (post?.files?.length) {
            const urls = post.files.map((file) => ({
                name: file.name,
                type: file.type,
                url: URL.createObjectURL(file),
            }));
            setFileURLs(urls);

            return () => {
                urls.forEach((file) => URL.revokeObjectURL(file.url));
            };
        }
    }, [post]);

    if (!post) return <div>게시물이 없습니다.</div>;

    const handleCommentChange = (e) => setComment(e.target.value);

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (comment.trim()) {
            addComment(postId, comment);
            setComment("");
        } else {
            alert("댓글을 입력해주세요.");  // User feedback for empty comment
        }
    };

    const handleClick = () => navigate("/community/notice");

    return (
        <>
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <hr className="community-hr" />
            <div className="main-container">
                <div className="title-section">
                    <div className="title"><h2>{post.title}</h2></div>
                    <div className="info">
                        <span>작성자: 관리자</span>
                        <span>작성일: {post.createDate}</span>
                    </div>
                </div>

                {/* 이미지 파일들 먼저 보여주기 */}
                <div className="attached-img">
                    {fileURLs.filter(f => f.type.startsWith("image/")).map((file, index) => (
                        <div className="img-preview" key={index}>
                            <img src={file.url} alt={`첨부 이미지 ${index}`} />
                        </div>
                    ))}
                </div>

                <div className="content">
                    <p>{post.content}</p>
                </div>

                <div className="list-btn">
                    <button onClick={handleClick}>목록</button>
                </div>

                {/* 모든 첨부파일 다운로드 목록 */}
                {fileURLs.length > 0 && (
                    <div className="attached-files">
                        <p>첨부파일:</p>
                        <ul>
                            {fileURLs.map((file, index) => (
                                <li key={index}>
                                    <a href={file.url} download={file.name} className="download-link">
                                        {file.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            <div className="comment-section">
                <div className="add-comment">
                    <h4>댓글쓰기</h4>
                    <div className="write-section">
                        <form onSubmit={handleCommentSubmit}>
                            <div className="write-comment">
                                <textarea
                                    id="comment"
                                    name="comment"
                                    placeholder="댓글을 입력해주세요."
                                    value={comment}
                                    onChange={handleCommentChange}
                                    required
                                />
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
                                <span>{comment.author}:</span>
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
