package com.example.cafe_lab.community.service;

import com.example.cafe_lab.community.dto.CommentDTO;
import com.example.cafe_lab.community.entity.BoardEntity;
import com.example.cafe_lab.community.entity.CommentEntity;
import com.example.cafe_lab.community.repository.BoardRepository;
import com.example.cafe_lab.community.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final BoardRepository boardRepository;

    // 댓글 목록 조회
    public List<CommentDTO> getCommentsByBoardId(Long postId) {
        List<CommentEntity> comments = commentRepository.findByBoard_Id(postId);
        return comments.stream()
                .map(CommentDTO::new)
                .collect(Collectors.toList());
    }

    // 닉네임으로 댓글 목록 조회
    public List<CommentDTO> getCommentsByNickname(String nickname) {
        List<CommentEntity> comments = commentRepository.findByNickname(nickname);
        return comments.stream()
                .map(comment -> {
                    CommentDTO dto = new CommentDTO();
                    dto.setId(comment.getId());

                    // BoardEntity가 null일 경우 예외 처리
                    if (comment.getBoard() != null) {
                        dto.setPostId(comment.getBoard().getId());  // 여기서 boardId를 postId로 설정
                    } else {
                        dto.setPostId(null);  // or handle accordingly (e.g., log or skip)
                    }

                    dto.setNickname(comment.getNickname());
                    dto.setComment(comment.getComment());
                    dto.setCreatedAt(comment.getCreatedAt());
                    dto.setUpdatedAt(comment.getUpdatedAt());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public CommentDTO addComment(Long postId, CommentDTO dto) {
        System.out.println("댓글 작성 요청: " + dto);

        BoardEntity board = boardRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시물이 존재하지 않습니다."));
        CommentEntity comment = new CommentEntity();
        comment.setBoard(board);
        comment.setNickname(dto.getNickname());
        comment.setComment(dto.getComment());
        comment.setCreatedAt(LocalDateTime.now());
        comment.setUpdatedAt(LocalDateTime.now());

        CommentEntity saved = commentRepository.save(comment);
        System.out.println("저장된 댓글 닉네임: " + saved.getNickname());

        return toDTO(saved);
    }

    public void deleteComment(Long commentId) {
        commentRepository.deleteById(commentId);
    }

    private CommentDTO toDTO(CommentEntity entity) {
        CommentDTO dto = new CommentDTO();
        dto.setId(entity.getId());
        dto.setPostId(entity.getBoard().getId());
        dto.setNickname(entity.getNickname());
        dto.setComment(entity.getComment());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }

    public List<CommentEntity> getCommentEntitiesByBoardId(Long postId) {
        return commentRepository.findByBoard_Id(postId);
    }
}