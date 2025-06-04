package com.example.cafe_lab.community.dto;

import com.example.cafe_lab.community.entity.BoardFileEntity;
import lombok.Getter;

@Getter
public class BoardFileDTO {
    private Long id;
    private String originalName;
    private String savedName;
    private String downloadUrl;
    private long size; // ✅ 파일 크기 필드 추가
    private String path;
    private String fileType;
    private Long postId;

    public BoardFileDTO(BoardFileEntity entity) {
        this.id = entity.getId();
        this.originalName = entity.getOriginalName();
        this.savedName = entity.getSavedName();
        this.downloadUrl = "/api/board/download/" + entity.getSavedName();
        this.size = entity.getSize(); // ✅ 엔티티에서 크기 받아오기
        this.path = entity.getPath(); // ✅ 경로 추가
        this.fileType = entity.getFileType();
        this.postId = entity.getBoard().getId();
    }

    // 🔧 필요하다면 생성자에도 추가 가능 (사용 중이라면)
    public BoardFileDTO(String originalName, String savedName, String downloadUrl, long size, String path, String fileType, Long postId) {
        this.originalName = originalName;
        this.savedName = savedName;
        this.downloadUrl = downloadUrl;
        this.size = size;
        this.path = path; // ✅ 경로 저장
        this.fileType = fileType;
        this.postId = postId;
    }
}

