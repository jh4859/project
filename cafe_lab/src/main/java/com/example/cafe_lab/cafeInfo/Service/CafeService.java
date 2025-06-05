package com.example.cafe_lab.cafeInfo.Service;

import com.example.cafe_lab.admin.Users;
import com.example.cafe_lab.admin.lognin.LoginRepository;
import com.example.cafe_lab.cafeInfo.Entity.*;
import com.example.cafe_lab.cafeInfo.Repository.CafeUploadRepository;
import com.example.cafe_lab.cafeInfo.Repository.CafeImageRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CafeService {

    private final CafeUploadRepository cafeUploadRepository;
    private final CafeImageRepository cafeImageRepository;
    @Autowired
    private LoginRepository loginRepository;  // LoginRepository 의존성 주입

    @Value("${file.upload-dir}")
    private String uploadDir;

    private final CafeApprovalService cafeApprovalService;

    // 카페 등록
    public void saveCafe(CafeDTO dto) {

        // 사용자 확인
        Users user = loginRepository.findById(dto.getUserId())  // DTO에서 사용자 ID를 받음
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 카페 엔티티 변환
        CafeUploadEntity entity = convertToEntity(dto);
        entity.setUser(user);  // 사용자 정보 설정

        // 승인 상태를 'PENDING'으로 설정
        entity.setApprovalStatus(CafeApprovalStatus.PENDING);

        cafeUploadRepository.save(entity);  // 카페 저장
    }

    // 카페 수정 (기존 이미지 삭제 + 새 이미지 추가 포함)
    @Transactional
    public void updateCafe(CafeDTO dto, List<String> deleteImgNames) {
        CafeUploadEntity entity = cafeUploadRepository.findById(dto.getId())
                .orElseThrow(() -> new IllegalArgumentException("카페 정보를 찾을 수 없습니다."));

        // 기본 정보 수정
        entity.setName(dto.getName());
        entity.setTitle(dto.getTitle());
        entity.setPlace(dto.getPlace());
        entity.setContent(dto.getContent());
        entity.setSns(dto.getSns());
        entity.setPhone(dto.getPhone());

        // 승인 상태 수정 (dto에 승인 상태가 있을 경우 업데이트)
        if (dto.getApprovalStatus() != null) {
            entity.setApprovalStatus(dto.getApprovalStatus());
        }

        // 기존 영업시간 초기화 후 새로 설정
        entity.getCafeHours().clear();
        List<CafeHours> updatedHours = dto.getCafeHours().entrySet().stream()
                .map(entry -> {
                    CafeHours hour = new CafeHours();
                    hour.setDay(entry.getKey());
                    hour.setHours(entry.getValue());
                    hour.setCafe(entity);
                    return hour;
                }).toList();
        entity.setCafeHours(updatedHours);

        // 삭제할 이미지 처리
        if (deleteImgNames != null && !deleteImgNames.isEmpty()) {
            Iterator<CafeImage> iterator = entity.getImages().iterator();
            while (iterator.hasNext()) {
                CafeImage image = iterator.next();
                if (deleteImgNames.contains(image.getImgName())) {
                    iterator.remove();                 // 리스트에서 제거

                    // 실제 파일 삭제
                    File file = new File(uploadDir + File.separator + image.getImgName());
                    if (file.exists()) {
                        if (file.delete()) {
                            System.out.println("파일 삭제 성공: " + file.getAbsolutePath());
                        } else {
                            System.err.println("파일 삭제 실패: " + file.getAbsolutePath());
                        }
                    }
                }
            }
        }

        // 새로운 이미지 추가
        if (dto.getImgURLs() != null && dto.getImgNames() != null) {
            for (int i = 0; i < dto.getImgURLs().size(); i++) {
                String imgName = dto.getImgNames().get(i);
                boolean exists = entity.getImages().stream()
                        .anyMatch(img -> img.getImgName().equals(imgName));
                if (!exists) {
                    String imgURL = dto.getImgURLs().get(i);

                    // 파일을 MultipartFile로 받지 않고, URL과 파일명을 통해 imgType과 imgSize를 추출
                    File file = new File(uploadDir + File.separator + imgName);
                    String imgType = "unknown";  // 기본값 설정
                    Long imgSize = 0L;           // 기본값 설정

                    if (file.exists()) {
                        imgType = getFileExtension(file);  // 파일 확장자를 가져옴 (예: jpg, png)
                        imgSize = file.length();           // 파일 크기 (바이트 단위)
                    }

                    CafeImage image = new CafeImage(imgURL, imgName, imgType, imgSize);
                    image.setCafe(entity);
                    entity.getImages().add(image);
                }
            }
        }

        // JPA의 변경 감지에 의해 자동 반영됨
    }

    // DTO -> Entity 변환 (save 시 사용)
    private CafeUploadEntity convertToEntity(CafeDTO dto) {
        CafeUploadEntity entity = new CafeUploadEntity();
        entity.setName(dto.getName());
        entity.setTitle(dto.getTitle());
        entity.setPlace(dto.getPlace());
        entity.setContent(dto.getContent());
        entity.setSns(dto.getSns());
        entity.setPhone(dto.getPhone());

        // 시간 정보 매핑
        if (dto.getCafeHours() != null) {
            List<CafeHours> hoursList = dto.getCafeHours().entrySet().stream()
                    .map(entry -> {
                        CafeHours hour = new CafeHours();
                        hour.setDay(entry.getKey());
                        hour.setHours(entry.getValue());
                        hour.setCafe(entity);  // 양방향 연관 설정
                        return hour;
                    }).toList();
            entity.setCafeHours(hoursList);
        } else {
            entity.setCafeHours(new ArrayList<>());
        }

        // 이미지 정보 매핑
        List<CafeImage> imageList = new ArrayList<>();
        if (dto.getImgURLs() != null && dto.getImgNames() != null) {
            for (int i = 0; i < dto.getImgURLs().size(); i++) {
                String imgUrl = dto.getImgURLs().get(i);
                String imgName = dto.getImgNames().get(i);

                // 파일을 MultipartFile로 받지 않고, URL과 파일명을 통해 imgType과 imgSize를 추출
                File file = new File(uploadDir + File.separator + imgName);
                String imgType = "unknown";  // 기본값 설정
                Long imgSize = 0L;           // 기본값 설정

                if (file.exists()) {
                    imgType = getFileExtension(file);  // 파일 확장자를 가져옴 (예: jpg, png)
                    imgSize = file.length();           // 파일 크기 (바이트 단위)
                }

                CafeImage image = new CafeImage(imgUrl, imgName, imgType, imgSize);
                image.setCafe(entity);
                imageList.add(image);
            }
        }
        entity.setImages(imageList);

        return entity;
    }

    // 파일 확장자 가져오기 (예: jpg, png)
    private String getFileExtension(File file) {
        String fileName = file.getName();
        int dotIndex = fileName.lastIndexOf(".");
        return (dotIndex > 0) ? fileName.substring(dotIndex + 1).toLowerCase() : "unknown";
    }
}

