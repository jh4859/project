package com.example.cafe_lab.community.dto;

import com.example.cafe_lab.community.entity.CommentEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
public class CommentDTO {
    private Long id;
    private Long postId;
    private String nickname;
    private String comment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public CommentDTO(CommentEntity entity) {
        this.id = entity.getId();
        this.postId = entity.getBoard().getId();
        this.nickname = entity.getNickname();
        this.comment = entity.getComment();
        this.createdAt = entity.getCreatedAt();
        this.updatedAt = entity.getUpdatedAt();
    }

    public CommentDTO(Long id, Long postId, String nickname, String comment, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.postId = postId;
        this.nickname = nickname;
        this.comment = comment;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public CommentDTO(CommentDTO comment) {
    }
}
