package com.example.cafe_lab.cafeInfo.Controller;

import com.example.cafe_lab.admin.Users;
import com.example.cafe_lab.admin.lognin.LoginRepository;
import com.example.cafe_lab.cafeInfo.Entity.*;
import com.example.cafe_lab.cafeInfo.Repository.CafeImageRepository;
import com.example.cafe_lab.cafeInfo.Repository.CafeUploadRepository;
import com.example.cafe_lab.cafeInfo.Service.CafeService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
//import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

// jwt 인증인가 관련 import
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173") // 프론트 주소
public class CafeUploadController {

    @Autowired
    private CafeUploadRepository cafeUploadRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;  // ← properties에서 불러옴

    @Autowired
    private CafeService cafeService;

    @Autowired
    private CafeImageRepository cafeImageRepository;

    // user외래키 설정관련
    @Autowired
    private LoginRepository loginRepository;


    private final String BASE_URL = "http://localhost:8080/images/";

    @PreAuthorize("hasRole('CAFE_OWNER')")  // ROLE_CAFE_OWNER 역할을 가진 사용자만 접근 가능
    @PostMapping("/addCafe")
    public ResponseEntity<?> addCafe(
            @AuthenticationPrincipal UserDetails userDetails,  // 인증된 사용자 정보 자동 주입
            @RequestPart("cafeData") String cafeData,
            @RequestPart("files") List<MultipartFile> files
    ) {
        // 확인
        System.out.println("UserDetails: " + userDetails);
        System.out.println("Username: " + (userDetails != null ? userDetails.getUsername() : "null"));

        String userid = userDetails.getUsername();  // UserDetails에서 사용자 ID를 얻음

        // userDetails에서 꺼낸 아이디를 다시 확인
        System.out.println("userid from userDetails: " + userid);

        // DB에서 Users 객체를 조회
        Users user = loginRepository.findByUserid(userid)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // userType이 1인 카페 사장만 처리
        if (user.getUserType() != 1) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("카페 사장만 접근 가능합니다.");
        }

        List<String> imageUrls = new ArrayList<>();
        List<String> imageNames = new ArrayList<>();
        List<String> imageTypes = new ArrayList<>();
        List<Long> imageSizes = new ArrayList<>();

        try {
            // cafedata를 dto로 변환
            ObjectMapper mapper = new ObjectMapper();
            CafeDTO dto = mapper.readValue(cafeData, CafeDTO.class);

            // 파일 업로드 디렉토리 생성
            File uploadPath = new File(uploadDir);
            if (!uploadPath.exists()) uploadPath.mkdirs();

            // 카페 엔티티 생성
            CafeUploadEntity cafe = new CafeUploadEntity();
            cafe.setName(dto.getName());
            cafe.setTitle(dto.getTitle());
            cafe.setPlace(dto.getPlace());
            cafe.setContent(dto.getContent());
            cafe.setSns(dto.getSns());
            cafe.setPhone(dto.getPhone());

            cafe.setUser(user);

            // 카페 영업시간 처리
            List<CafeHours> hoursList = new ArrayList<>();
            if (dto.getCafeHours() != null) {
                for (Map.Entry<String, String> entry : dto.getCafeHours().entrySet()) {
                    // CafeHours 객체 생성
                    CafeHours hour = new CafeHours();
                    hour.setDay(entry.getKey());
                    hour.setHours(entry.getValue());
                    hour.setCafe(cafe);  // 카페와의 연관관계 설정

                    hoursList.add(hour);
                }
            }

            cafe.setCafeHours(hoursList);

            // 이미지 저장
            List<CafeImage> images = new ArrayList<>();
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                    File dest = new File(uploadDir + fileName);
                    file.transferTo(dest);

                    String fileURL = BASE_URL + fileName;
                    imageUrls.add(fileURL);
                    imageNames.add(fileName);

                    // 이미지 타입과 크기 추가
                    String fileExtension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf('.') + 1);
                    Long fileSize = file.getSize();
                    imageTypes.add(fileExtension);
                    imageSizes.add(fileSize);

                    // CafeImage 객체 생성
                    CafeImage image = new CafeImage();
                    image.setImgURL(fileURL);
                    image.setImgName(fileName);
                    image.setImgType(fileExtension);  // 타입
                    image.setImgSize(fileSize);       // 크기
                    image.setCafe(cafe); // 외래키 설정

                    images.add(image);
                }
            }

            // 승인 상태 설정
            if (dto.getApprovalStatus() != null) {
                cafe.setApprovalStatus(dto.getApprovalStatus());  // DTO에서 받은 승인 상태 설정
            } else {
                cafe.setApprovalStatus(CafeApprovalStatus.PENDING);  // 기본값: 승인 대기
            }

            // 승인/거절 시간 설정
            if (dto.getApprovalStatus() == CafeApprovalStatus.APPROVED || dto.getApprovalStatus() == CafeApprovalStatus.REJECTED) {
                cafe.setApprovalAt(LocalDateTime.now());  // 승인/거절 시간이 필요할 경우 현재 시간으로 설정
            }

            // 이미지 목록을 카페 엔티티에 설정
            cafe.setImages(images);

            // 카페 정보 저장 (cascade 및 orphanRemoval 설정에 의해 함께 저장됨)
            cafeUploadRepository.save(cafe);

            return ResponseEntity.ok(Map.of("success", true, "imageUrls", imageUrls));

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "카페 등록 중 오류 발생"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(
                    Map.of("success", false, "message", "DB 저장 오류: " + e.getMessage())
            );
        }
    }


    @GetMapping("/cafes")
    public List<CafeDTO> getCafeList() {
        List<CafeUploadEntity> entities = cafeUploadRepository.findAll();

        return entities.stream().map(entity -> {
            CafeDTO dto = new CafeDTO();
            dto.setId(entity.getId());
            dto.setName(entity.getName());
            dto.setTitle(entity.getTitle());
            dto.setPlace(entity.getPlace());
            dto.setContent(entity.getContent());
            dto.setSns(entity.getSns());
            dto.setPhone(entity.getPhone());

            // approvalStatus를 CafeDTO에 직접 설정
            dto.setApprovalStatus(entity.getApprovalStatus());

            // CafeHours → Map<String, String> 변환
            Map<String, String> cafeHoursMap = new HashMap<>();
            if (entity.getCafeHours() != null) {
                for (CafeHours hour : entity.getCafeHours()) {
                    cafeHoursMap.put(hour.getDay(), hour.getHours());
                }
            }
            dto.setCafeHours(cafeHoursMap); // 변환한 Map 적용

            List<String> urls = new ArrayList<>();
            List<String> names = new ArrayList<>();
            for (CafeImage img : entity.getImages()) {
                urls.add(img.getImgURL());
                names.add(img.getImgName());
            }
            dto.setImgURLs(urls);
            dto.setImgNames(names);

            dto.setRegDate(entity.getRegDate());  // regDate를 DTO에 설정
            dto.setApprovalAt(entity.getApprovalAt()); // approvalAt을 DTO에 설정

            return dto;
        }).collect(Collectors.toList());
    }

    // 카페 삭제
    @DeleteMapping("/deleteCafe/{id}")
    public ResponseEntity<String> deleteCafe(@PathVariable Long id) {
        Optional<CafeUploadEntity> cafeOptional = cafeUploadRepository.findById(id);

        if (cafeOptional.isPresent()) {
            CafeUploadEntity cafe = cafeOptional.get();

            // 이미지 삭제: 카페에 연결된 모든 이미지 삭제
            if (cafe.getImages() != null) {
                for (CafeImage image : cafe.getImages()) {
                    // 여기서는 파일명을 사용하여 실제 파일 경로 생성
                    String fileName = image.getImgName();  // 저장시 사용한 파일명
                    File file = new File(uploadDir + fileName);
                    if (file.exists()) {
                        boolean deleted = file.delete();
                        if (!deleted) {
                            // 삭제 실패 시 로그 출력 (실제 서비스에서는 로깅 시스템 활용)
                            System.err.println("파일 삭제 실패: " + file.getAbsolutePath());
                        }
                    }
                }
            }

            // DB에서 카페 데이터 삭제
            cafeUploadRepository.deleteById(id);
            return ResponseEntity.ok("삭제 성공");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 카페가 존재하지 않습니다.");
        }
    }

    // 카페 수정
    @Transactional
    @PostMapping(value = "/editCafe/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> editCafe(
            @PathVariable Long id,
            @RequestPart("cafeData") String cafeDataStr,
            @RequestPart(value = "files", required = false) List<MultipartFile> files,
            @RequestParam(value = "deleteImgNames", required = false) List<String> deleteImgNames
    ) {
        try {
            // 기존 카페 엔티티 조회
            ObjectMapper mapper = new ObjectMapper();
            CafeDTO cafeData = mapper.readValue(cafeDataStr, CafeDTO.class);

            Optional<CafeUploadEntity> optionalCafe = cafeUploadRepository.findById(id);
            if (optionalCafe.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 카페가 존재하지 않습니다.");
            }
            CafeUploadEntity cafe = optionalCafe.get();

            List<CafeImage> existingImages = cafe.getImages();

            // 삭제될 이미지 처리
            if (deleteImgNames != null && !deleteImgNames.isEmpty()) {
                // DB에서 삭제할 이미지 삭제
                cafeImageRepository.deleteByImgNameIn(deleteImgNames);

                // 삭제된 이미지를 리스트에서 제거
                existingImages.removeIf(image -> deleteImgNames.contains(image.getImgName()));

                // 실제 파일 삭제
                for (String fileName : deleteImgNames) {
                    String filePath = uploadDir + fileName;
                    File file = new File(filePath);
                    if (file.exists()) {
                        boolean deleted = file.delete();
                        if (deleted) {
                            System.out.println("파일 삭제 성공: " + file.getAbsolutePath());
                        } else {
                            System.err.println("파일 삭제 실패: " + file.getAbsolutePath());
                        }
                    }
                }
            }

            // 새 이미지 처리
            if (files != null && !files.isEmpty()) {
                for (MultipartFile file : files) {
                    if (!file.isEmpty()) {
                        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
                        String filePath = uploadDir + fileName;

                        // 파일 저장
                        file.transferTo(new File(filePath));

                        // 이미지 타입과 크기 추출
                        String fileExtension = file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf('.') + 1);
                        Long fileSize = file.getSize();

                        // 새 이미지 객체 생성
                        CafeImage newImage = new CafeImage();
                        newImage.setImgName(fileName);
                        newImage.setImgURL(BASE_URL + fileName);
                        newImage.setImgType(fileExtension);  // 타입
                        newImage.setImgSize(fileSize);       // 크기
                        newImage.setCafe(cafe);
                        existingImages.add(newImage);

                        System.out.println("새 이미지 추가: " + fileName);
                    }
                }
            }

            // 카페 정보 업데이트
            cafe.setName(cafeData.getName());
            cafe.setTitle(cafeData.getTitle());
            cafe.setPlace(cafeData.getPlace());
            cafe.setContent(cafeData.getContent());
            cafe.setSns(cafeData.getSns());
            cafe.setPhone(cafeData.getPhone());

            // 영업시간 업데이트
            List<CafeHours> hoursList = new ArrayList<>();
            if (cafeData.getCafeHours() != null) {
                for (Map.Entry<String, String> entry : cafeData.getCafeHours().entrySet()) {
                    Optional<CafeHours> existingHourOpt = cafe.getCafeHours().stream()
                            .filter(hour -> hour.getDay().equals(entry.getKey()))
                            .findFirst();

                    CafeHours hour;
                    if (existingHourOpt.isPresent()) {
                        hour = existingHourOpt.get();
                        hour.setHours(entry.getValue());
                    } else {
                        hour = new CafeHours();
                        hour.setDay(entry.getKey());
                        hour.setHours(entry.getValue());
                        hour.setCafe(cafe);
                    }
                    hoursList.add(hour);
                }
            }

            // 승인 상태 설정
            if (cafeData.getApprovalStatus() != null) {
                cafe.setApprovalStatus(cafeData.getApprovalStatus());  // DTO에서 받은 승인 상태 설정
            } else {
                cafe.setApprovalStatus(CafeApprovalStatus.PENDING);  // 기본값: 승인 대기
            }

            // 승인/거절 시간 설정 (PENDING이 아닌 경우에만 설정)
            if (cafeData.getApprovalStatus() != CafeApprovalStatus.PENDING) {
                cafe.setApprovalAt(LocalDateTime.now());  // 승인/거절 시간이 필요할 경우 현재 시간으로 설정
            }


            cafe.setCafeHours(hoursList);

            // 카페 정보 저장
            cafeUploadRepository.save(cafe);

            return ResponseEntity.ok(Map.of("success", true));

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("파일 처리 오류: " + e.getMessage());
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("예상치 못한 오류: " + e.getMessage());
        }
    }






    // 카페 수정할 때 데이터
    @GetMapping("/cafe/{id}")
    public ResponseEntity<?> getCafeById(@PathVariable Long id) {
        Optional<CafeUploadEntity> optionalCafe = cafeUploadRepository.findById(id);

        if (optionalCafe.isPresent()) {
            CafeUploadEntity entity = optionalCafe.get();

            CafeDTO dto = new CafeDTO();
            dto.setId(entity.getId());
            dto.setName(entity.getName());
            dto.setTitle(entity.getTitle());
            dto.setPlace(entity.getPlace());
            dto.setContent(entity.getContent());
            dto.setSns(entity.getSns());
            dto.setPhone(entity.getPhone());

            // CafeHours를 Map<String, String>으로 변환
            Map<String, String> cafeHoursMap = new HashMap<>();
            for (CafeHours hour : entity.getCafeHours()) {
                cafeHoursMap.put(hour.getDay(), hour.getHours());
            }
            dto.setCafeHours(cafeHoursMap); // 변환된 cafeHours 설정

            List<String> imgURLs = new ArrayList<>();
            List<String> imgNames = new ArrayList<>();
            List<String> imgTypes = new ArrayList<>();
            List<Long> imgSizes = new ArrayList<>();
            for (CafeImage img : entity.getImages()) {
                imgURLs.add(img.getImgURL());
                imgNames.add(img.getImgName());

                // 이미지 타입과 크기 추출
                String fileExtension = img.getImgName().substring(img.getImgName().lastIndexOf('.') + 1);
                File file = new File(uploadDir + img.getImgName());
                imgTypes.add(fileExtension);
                imgSizes.add(file.exists() ? file.length() : 0L);
            }

            dto.setImgURLs(imgURLs);
            dto.setImgNames(imgNames);
            dto.setImgTypes(imgTypes); // 추가된 타입
            dto.setImgSizes(imgSizes); // 추가된 크기


            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("해당 카페가 존재하지 않습니다.");
        }
    }
}
