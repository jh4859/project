package com.example.cafe_lab.community.dto;

import com.example.cafe_lab.admin.Users;
import com.example.cafe_lab.community.entity.BoardEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
public class BoardDTO {

    private Long id;
    private String title;
    private String textContent;
    private List<String> imageUrls;
    private String category;
    private java.time.LocalDateTime createDate;
    private List<BoardFileDTO> files;
    private String nickname;
    private Integer userType; // ✅ userType 필드 추가

    public BoardDTO(BoardEntity entity) {
        this.id = entity.getId();
        this.title = entity.getTitle();
        this.textContent = entity.getTextContent();
        this.category = entity.getCategory();
        this.createDate = entity.getCreatedAt();
        if (entity.getFiles() != null) {
            this.files = entity.getFiles().stream()
                    .map(BoardFileDTO::new)
                    .collect(Collectors.toList());
        }
        // ✅ 이미지 URL 리스트 변환 추가
        if (entity.getImages() != null) {
            this.imageUrls = entity.getImages().stream()
                    .map(image -> image.getImgUrl())
                    .collect(Collectors.toList());
        }

        // 작성자 닉네임 설정
        if (entity.getUser() != null) {
            this.nickname = entity.getUser().getNickname(); // ✅ 작성자 닉네임 설정
            this.userType = entity.getUser().getUserType(); // ✅ userType 설정

        }
    }
}

