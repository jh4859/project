package com.example.cafe_lab.community.controller;

import com.example.cafe_lab.community.dto.CommentDTO;
import com.example.cafe_lab.community.entity.CommentEntity;
import com.example.cafe_lab.community.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    @Autowired
    private final CommentService commentService;

    @GetMapping("/{postId}")
    public List<CommentDTO> getCommentsByBoardId(@PathVariable Long postId) {
        return commentService.getCommentsByBoardId(postId);
    }

    @GetMapping("/user")
    public List<CommentDTO> getCommentsByNickname(@RequestParam("nickname") String nickname) {
        if (nickname == null || nickname.trim().isEmpty()) {
            throw new IllegalArgumentException("닉네임이 비어 있습니다.");
        }

        List<CommentDTO> comments = commentService.getCommentsByNickname(nickname);
        return comments;
    }

    @PostMapping("/{postId}")
    public CommentDTO addComment(@PathVariable("postId") Long postId, @RequestBody CommentDTO dto) {
        return commentService.addComment(postId, dto);
    }

    @DeleteMapping("/{commentId}")
    public void deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
    }
}