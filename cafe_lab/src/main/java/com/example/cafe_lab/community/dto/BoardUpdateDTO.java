package com.example.cafe_lab.community.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Setter
@Getter
public class BoardUpdateDTO {

    private Long postId;
    private String category;
    private String title;
    private String textContent;
    private List<String> imageUrls;         // 새로 업로드된 이미지 URL
    private List<String> imagesToKeep;      // 유지할 기존 이미지 URL
    private List<Long> deletedFileIds;      // 삭제할 기존 파일 ID

    private List<MultipartFile> imageFiles;  // 새 이미지 파일들
    private List<MultipartFile> files;       // 새 일반 파일들
}
