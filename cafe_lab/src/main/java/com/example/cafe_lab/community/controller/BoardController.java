package com.example.cafe_lab.community.controller;

import com.example.cafe_lab.admin.Users;
import com.example.cafe_lab.admin.lognin.LoginRepository;
import com.example.cafe_lab.community.dto.BoardDTO;
import com.example.cafe_lab.community.dto.BoardDetailDTO;
import com.example.cafe_lab.community.dto.BoardUpdateDTO;
import com.example.cafe_lab.community.entity.BoardEntity;
import com.example.cafe_lab.community.entity.BoardFileEntity;
import com.example.cafe_lab.community.repository.BoardFileRepository;
import com.example.cafe_lab.community.service.BoardService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;

@RestController
@RequestMapping("/api/board")
public class BoardController {

    @Autowired
    private ObjectMapper objectMapper;

    private final BoardService boardService;
    private final LoginRepository loginRepository;
    private final BoardFileRepository boardFileRepository;

    @Value("${file.upload.dir}")
    private String uploadDir;

    @Autowired
    public BoardController(BoardService boardService, LoginRepository loginRepository, BoardFileRepository boardFileRepository) {
        this.boardService = boardService;
        this.loginRepository = loginRepository;
        this.boardFileRepository = boardFileRepository;
    }

    // 게시글 등록
    @PostMapping("/{category}")
    public ResponseEntity<?> saveBoard(
            @PathVariable("category") String category,
            @RequestParam("title") String title,
            @RequestParam("textContent") String textContent,
            @RequestParam(value = "imageUrls", required = false) List<String> imageUrls,
            @RequestPart(value = "imageFiles", required = false) List<MultipartFile> imageFiles,
            @RequestPart(value = "files", required = false) List<MultipartFile> files
    ) {
        try {
            // 인증된 사용자 정보 가져오기
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Object principal = authentication.getPrincipal();

            String userIdStr = null;
            if (principal instanceof String) {
                userIdStr = (String) principal; // principal이 String일 경우
            } else if (principal instanceof UserDetails) {
                userIdStr = ((UserDetails) principal).getUsername(); // principal이 UserDetails일 경우
            }

            if (userIdStr == null) {
                throw new RuntimeException("사용자 정보를 찾을 수 없습니다.");
            }

            // User ID로 Users 객체 조회
            Users user = loginRepository.findByUserid(userIdStr)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            // 로그인한 사용자의 닉네임 가져오기
            String nickname = user.getNickname(); // Users 객체에서 닉네임 가져오기

            // 게시글을 저장하며, 로그인한 사용자의 닉네임을 사용
            boardService.savePost(user, category, title, textContent, nickname, imageUrls, files, imageFiles);

            return ResponseEntity.ok("게시글 등록 완료!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("게시글 등록 실패: " + e.getMessage());
        }
    }

    // 이미지 업로드 (CKEditor에서 사용)
    @PostMapping(value = "/image-upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadImage(@RequestParam("upload") MultipartFile file, HttpServletRequest request) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("uploaded", false, "error", Map.of("message", "빈 파일입니다.")));
            }

            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf(".")) : ".png";
            String savedFilename = UUID.randomUUID().toString() + fileExtension;

            Path savePath = Paths.get(uploadDir, savedFilename);
            Files.createDirectories(savePath.getParent());
            Files.copy(file.getInputStream(), savePath, StandardCopyOption.REPLACE_EXISTING);

            // 요청 기준 base URL 가져오기 (예: http://localhost:8080)
            String baseUrl = ServletUriComponentsBuilder.fromRequestUri(request)
                    .replacePath(null)
                    .build()
                    .toUriString();

            String fullUrl = baseUrl + "/uploads/" + savedFilename;

            Map<String, Object> response = new HashMap<>();
            response.put("uploaded", true);
            response.put("url", fullUrl);  // 절대경로 URL 반환

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("uploaded", false, "error", Map.of("message", "업로드 실패: " + e.getMessage())));
        }
    }

    // 게시글 전체 목록
    @GetMapping
    public ResponseEntity<?> getAllPosts() {
        try {
            List<BoardDTO> posts = boardService.getAllPosts();

            // 게시글 목록에 작성자 닉네임 포함
            for (BoardDTO post : posts) {
                // 이미 DTO에 nickname이 들어 있다면 이 줄은 불필요함
                // 필요하다면 아래처럼 사용
                String nickname = post.getNickname();
                post.setNickname(nickname);
            }
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("게시글 목록 조회 실패: " + e.getMessage());
        }
    }

    // 게시글 상세 조회 (본문 + 댓글 포함)
    @GetMapping("/{category}/{postId}")
    public ResponseEntity<?> getPostDetailWithComments(@PathVariable("category") String category, @PathVariable("postId") Long postId) {
        try {
            BoardDetailDTO detail = boardService.getPostDetail(postId);
            return ResponseEntity.ok(detail);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("게시글을 찾을 수 없습니다.");
        }
    }

    // 파일 다운로드 (원본 파일명 유지)
    @GetMapping("/download/{filename:.+}")
    public ResponseEntity<FileSystemResource> downloadFile(@PathVariable("filename") String filename) throws IOException {
        // DB에서 savedName에 해당하는 파일 정보 조회
        Optional<BoardFileEntity> optionalFile = boardFileRepository.findBySavedName(filename);
        if (optionalFile.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        BoardFileEntity fileInfo = optionalFile.get();
        String originalFilename = fileInfo.getOriginalName(); // "Hospital Data Status.csv"

        File file = new File(uploadDir + "/" + filename);
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }

        // 파일 이름 인코딩
        String encodedFilename = URLEncoder.encode(originalFilename, StandardCharsets.UTF_8).replaceAll("\\+", "%20");

        String contentType = Files.probeContentType(file.toPath());
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        FileSystemResource resource = new FileSystemResource(file);

        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename*=UTF-8''" + encodedFilename)
                .header("Content-Type", contentType)
                .body(resource);
    }

    //게시글 삭제
    @DeleteMapping("/{category}/{postId}")
    public ResponseEntity<String> deletePost(
            @PathVariable("category") String category,
            @PathVariable("postId") Long postId,
            Authentication authentication
    ) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }

        // 로그인한 사용자 userid
        String currentUserid = authentication.getName();  // 또는 ((User) authentication.getPrincipal()).getUsername();

        // 게시글 조회
        BoardEntity post = boardService.getPostEntityById(category, postId);
        if (post == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("게시물이 존재하지 않습니다.");
        }

        String postWriterUserid = post.getUser().getUserid();  // 작성자 userid로 변경

        // 작성자 ID 또는 관리자일 경우 삭제 허용
        if (postWriterUserid.equalsIgnoreCase(currentUserid) || "admin".equalsIgnoreCase(currentUserid)) {
            boardService.deletePost(postId);
            return ResponseEntity.ok("게시물이 삭제되었습니다.");
        } else {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("게시물 삭제 권한이 없습니다.");
        }
    }

    //게시글 수정
    @PostMapping(value = "/edit/{category}/{postId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateBoard(
            @PathVariable("category") String category,
            @PathVariable("postId") Long postId,
            @RequestParam List<String> imagesToKeep,
            @ModelAttribute BoardUpdateDTO boardUpdateDTO
    ) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Object principal = authentication.getPrincipal();

            String userIdStr = null;
            if (principal instanceof String) {
                userIdStr = (String) principal;
            } else if (principal instanceof UserDetails) {
                userIdStr = ((UserDetails) principal).getUsername();
            }

            if (userIdStr == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("사용자 인증 실패");
            }

            Users user = loginRepository.findByUserid(userIdStr)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

            boardUpdateDTO.setCategory(category);
            boardUpdateDTO.setPostId(postId);

            boardService.updatePost(boardUpdateDTO, user);

            return ResponseEntity.ok("게시글 수정 완료!");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("게시글 수정 실패: " + e.getMessage());
        }
    }
}
