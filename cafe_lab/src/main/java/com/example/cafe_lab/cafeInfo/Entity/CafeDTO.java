package com.example.cafe_lab.cafeInfo.Entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Getter
@Setter

public class CafeDTO {
    private Long id;
    private String name;
    private String title;
    private String place;
    private String content;
    private String sns;
    private String phone;
    private Map<String, String> cafeHours;
    private List<String> imgURLs;
    private List<String> imgNames;
    private List<String> deleteImgNames; // 삭제할 이미지 파일명 리스트

    private LocalDateTime regDate;

    private List<String> imgTypes;  // 이미지 파일 타입 리스트 (예: jpg, png)
    private List<Long> imgSizes;  // 이미지 파일 크기 리스트 (바이트 단위)

    private Long userId;

    // 승인 관련
    private CafeApprovalStatus approvalStatus;  // PENDING, APPROVED, REJECTED
    private LocalDateTime approvalAt;           // 승인 or 거절 시간

//    private List<MultipartFile> images;

    public CafeDTO() {}
}

