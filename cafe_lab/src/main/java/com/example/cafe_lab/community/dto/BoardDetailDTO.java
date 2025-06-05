package com.example.cafe_lab.community.dto;

import com.example.cafe_lab.community.entity.BoardEntity;
import com.example.cafe_lab.community.entity.ComImgEntity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class BoardDetailDTO {
    private Long id;
    private String title;
    private String textContent;
    private String category;
    private LocalDateTime createDate;
    private List<String> imageUrls;
    private List<CommentDTO> comments;
    private List<BoardFileDTO> files; // ✅ 추가
    private String nickname;

    public BoardDetailDTO(BoardEntity entity, List<CommentDTO> comments, List<BoardFileDTO> fileDTOs) {
        this.id = entity.getId();
        this.title = entity.getTitle();
        this.textContent = entity.getTextContent();
        this.category = entity.getCategory();
        this.createDate = entity.getCreatedAt();
        this.nickname = entity.getUser().getNickname();

        // populate your imageUrls from the ComImgEntity list
        this.imageUrls = entity.getImages()
                .stream()
                .map(ComImgEntity::getImgUrl)
                .collect(Collectors.toList());

        this.comments = comments;
        this.files = entity.getFiles()
                .stream()
                .map(BoardFileDTO::new)
                .collect(Collectors.toList());
    }
}
