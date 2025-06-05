package com.example.cafe_lab.community.service;

import com.example.cafe_lab.admin.Users;
import com.example.cafe_lab.admin.lognin.LoginRepository;
import com.example.cafe_lab.community.dto.*;
import com.example.cafe_lab.community.entity.BoardEntity;
import com.example.cafe_lab.community.entity.BoardFileEntity;
import com.example.cafe_lab.community.entity.ComImgEntity;
import com.example.cafe_lab.community.repository.BoardFileRepository;
import com.example.cafe_lab.community.repository.BoardImageRepository;
import com.example.cafe_lab.community.repository.BoardRepository;
import com.example.cafe_lab.community.repository.CommentRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BoardService {

    private final BoardRepository boardRepository;
    private final BoardFileRepository boardFileRepository;
    private final CommentService commentService;
    private final LoginRepository loginRepository;
    private final CommentRepository commentRepository;
    private final BoardImageRepository boardImageRepository;

    @Value("${file.upload.dir}")
    private String uploadDir;

    @Autowired
    public BoardService(BoardRepository boardRepository, BoardFileRepository boardFileRepository,
                        CommentService commentService, LoginRepository loginRepository,
                        CommentRepository commentRepository, BoardImageRepository boardImageRepository) {
        this.boardRepository = boardRepository;
        this.boardFileRepository = boardFileRepository;
        this.commentService = commentService;
        this.loginRepository = loginRepository;
        this.commentRepository = commentRepository;
        this.boardImageRepository = boardImageRepository;
    }

    // 게시글 목록 조회
    public List<BoardDTO> getAllPosts() {
        return boardRepository.findAllWithUser().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // 엔티티를 DTO로 변환하면서 닉네임 포함
    public BoardDTO convertToDTO(BoardEntity boardEntity) {
        List<BoardFileDTO> fileDTOs = boardEntity.getFiles().stream()
                .map(file -> new BoardFileDTO(
                        file.getOriginalName(),
                        file.getSavedName(),
                        "/api/board/download/" + file.getSavedName(),
                        file.getSize(),
                        file.getPath(),
                        file.getFileType(),
                        file.getBoard().getId()
                ))
                .collect(Collectors.toList());

        BoardDTO dto = new BoardDTO();
        dto.setId(boardEntity.getId());
        dto.setTitle(boardEntity.getTitle());
        dto.setTextContent(boardEntity.getTextContent());
        dto.setCategory(boardEntity.getCategory());
        dto.setCreateDate(boardEntity.getCreatedAt());
        dto.setFiles(fileDTOs);
        dto.setNickname(boardEntity.getUser().getNickname()); // ✅ 닉네임 포함

        return dto;
    }

    // 게시글 저장
    public void savePost(Users user, String category, String title, String textContent, String nickname, List<String> imageUrls, List<MultipartFile> files, List<MultipartFile> imageFiles) {
        BoardEntity board = new BoardEntity();
        board.setCategory(category);
        board.setTitle(title);
        board.setTextContent(textContent);
        board.setUser(user);

        String baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();

        List<ComImgEntity> imageEntities = new ArrayList<>();
        if (imageFiles != null && !imageFiles.isEmpty()) {
            for (MultipartFile imageFile : imageFiles) {
                String originalFilename = imageFile.getOriginalFilename();
                String fileExtension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf(".")) : ".jpg";
                String savedFilename = UUID.randomUUID().toString() + "_" + originalFilename;
                Path path = Paths.get(uploadDir + "/" + savedFilename);

                try {
                    Files.copy(imageFile.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

                    ComImgEntity imageEntity = new ComImgEntity();
                    imageEntity.setImgName(originalFilename);
                    imageEntity.setImgSize(Long.valueOf(imageFile.getSize()));
                    imageEntity.setImgType(imageFile.getContentType());
                    imageEntity.setImgUrl(baseUrl + "/uploads/" + savedFilename);
                    imageEntity.setBoard(board);

                    imageEntities.add(imageEntity);
                } catch (IOException e) {
                    throw new RuntimeException("이미지 업로드 중 오류 발생", e);
                }
            }
        }
        board.setImages(imageEntities);

        List<BoardFileEntity> fileEntities = new ArrayList<>();
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                String originalFilename = file.getOriginalFilename();
                String fileExtension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf(".")) : ".tmp";
                String savedFilename = UUID.randomUUID().toString() + "_" + originalFilename;
                Path path = Paths.get(uploadDir + "/" + savedFilename);

                try {
                    Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

                    BoardFileEntity fileEntity = new BoardFileEntity();
                    fileEntity.setOriginalName(originalFilename);
                    fileEntity.setSavedName(savedFilename);
                    fileEntity.setSize(Long.valueOf(file.getSize()));
                    fileEntity.setPath(path.toString());
                    fileEntity.setFileType(file.getContentType());
                    fileEntity.setBoard(board);

                    fileEntities.add(fileEntity);
                } catch (IOException e) {
                    throw new RuntimeException("파일 업로드 중 오류 발생", e);
                }
            }
        }
        board.setFiles(fileEntities);

        boardRepository.save(board);
    }

    // 게시글 ID로 조회 (카테고리 포함)
    public BoardDTO getPostById(String category, Long id) {
        BoardEntity post = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글이 존재하지 않습니다."));

        return convertToDTO(post); // ✅ 닉네임 포함된 DTO 사용
    }

    // 상세보기 DTO 반환
    public BoardDetailDTO getPostDetail(Long postId) {
        BoardEntity board = boardRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 없습니다."));

        List<CommentDTO> commentDTOs = commentService.getCommentsByBoardId(postId);

        List<BoardFileDTO> fileDTOs = board.getFiles().stream()
                .map(BoardFileDTO::new)
                .collect(Collectors.toList());

        return new BoardDetailDTO(board, commentDTOs, fileDTOs);
    }

    //게시글 삭제
    @Transactional
    public void deletePost(Long postId) {
        // 1. 게시글 조회
        BoardEntity post = boardRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시물이 존재하지 않습니다."));

        // 2. 댓글 삭제
        commentRepository.deleteByBoard_Id(postId);

        // 3. 이미지 삭제
        List<ComImgEntity> images = boardImageRepository.findByBoardId(postId);
        for (ComImgEntity image : images) {
            File imgFile = new File(uploadDir + "/" + image.getImgName());
            if (imgFile.exists()) {
                imgFile.delete();
            }
            boardImageRepository.delete(image);
        }

        // 4. 파일 삭제
        List<BoardFileEntity> files = boardFileRepository.findByBoard_Id(postId);
        for (BoardFileEntity file : files) {
            File storedFile = new File(uploadDir + "/" + file.getSavedName());
            if (storedFile.exists()) {
                storedFile.delete();
            }
            boardFileRepository.delete(file);
        }

        // 5. 게시글 삭제
        boardRepository.delete(post);
    }

    public BoardEntity getPostEntityById(String category, Long postId) {
        return boardRepository.findByCategoryAndId(category, postId).orElse(null);
    }

    //게시글 수정
    @Transactional
    public void updatePost(BoardUpdateDTO dto, Users user) throws IOException {
        Long postId = dto.getPostId();
        String category = dto.getCategory();
        String title = dto.getTitle();
        String textContent = dto.getTextContent();
        List<String> imageUrls = dto.getImageUrls();
        List<MultipartFile> imageFiles = dto.getImageFiles();
        List<MultipartFile> files = dto.getFiles();
        List<Long> filesToDeleteIds = dto.getDeletedFileIds();

        System.out.println("imageUrls.size() = " + (imageUrls != null ? imageUrls.size() : "null"));

        if (imageUrls != null && !imageUrls.isEmpty()) {
            System.out.println("첫 번째 요소 타입: " + imageUrls.get(0).getClass().getName());
            System.out.println("첫 번째 요소 값: " + imageUrls.get(0));
        }

        // 1. 게시글 조회 및 권한 체크
        BoardEntity board = boardRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        if (!board.getUser().getU_id().equals(user.getU_id())) {
            throw new RuntimeException("게시글 수정 권한이 없습니다.");
        }

        // 2. 게시글 기본 정보 수정
        board.setCategory(category);
        board.setTitle(title);
        board.setTextContent(textContent);

        // 3. 기존 이미지 조회
        List<ComImgEntity> existingImages = boardImageRepository.findByBoardId(postId);

        // 4. 클라이언트가 보낸 이미지 URL에서 저장된 파일명만 추출 (유지 대상 이미지)
        List<String> imagesToKeep = (imageUrls != null && !imageUrls.isEmpty())
                ? imageUrls.stream()
                .map(url -> {
                    try {
                        return Paths.get(URI.create(url).getPath()).getFileName().toString();
                    } catch (Exception e) {
                        System.err.println("클라이언트 URL 파싱 실패: " + url);
                        return "";
                    }
                })
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList())
                : Collections.emptyList();

        System.out.println("서버에서 받은 이미지 URL 리스트 (유지 대상): " + imagesToKeep);
        System.out.println("uploadDir 경로: " + uploadDir);

        // 5. 삭제할 이미지 필터링 및 삭제
        Iterator<ComImgEntity> iterator = existingImages.iterator();
        while (iterator.hasNext()) {
            ComImgEntity img = iterator.next();
            String filename = "";
            try {
                URI uri = URI.create(img.getImgUrl());
                filename = Paths.get(uri.getPath()).getFileName().toString();
            } catch (Exception e) {
                System.err.println("이미지 URL 파싱 실패: " + img.getImgUrl());
                e.printStackTrace();
                continue;
            }

            String normalizedFilename = filename.trim().toLowerCase();

            boolean isKept = imagesToKeep.stream()
                    .map(String::trim)
                    .map(String::toLowerCase)
                    .anyMatch(name -> name.equals(normalizedFilename));

            System.out.println("비교 이미지 파일명: " + normalizedFilename + ", 유지 여부: " + isKept);

            if (!isKept) {
                File file = new File(uploadDir + File.separator + filename);
                if (file.exists()) {
                    boolean deleted = file.delete();
                    System.out.println(deleted ? "파일 삭제 성공: " + filename : "파일 삭제 실패: " + filename);
                }
                iterator.remove();
                boardImageRepository.delete(img);
            } else {
                System.out.println("이미지 유지됨: " + filename);
            }
        }
        boardImageRepository.flush();

        // 6. 새 이미지 저장
        if (imageFiles != null) {
            for (MultipartFile multipartFile : imageFiles) {
                if (!multipartFile.isEmpty()) {
                    String savedFilename = saveFile(uploadDir, multipartFile);

                    String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                            .path("/uploads/")
                            .path(savedFilename)
                            .toUriString();

                    ComImgEntity newImage = new ComImgEntity();
                    newImage.setBoard(board);
                    newImage.setImgUrl(fileDownloadUri);
                    newImage.setImgName(multipartFile.getOriginalFilename());
                    newImage.setImgSize(Long.valueOf(multipartFile.getSize()));
                    newImage.setImgType(multipartFile.getContentType());

                    boardImageRepository.save(newImage);
                }
            }
        }

        // 7. 기존 첨부파일 조회
        List<BoardFileEntity> existingFiles = boardFileRepository.findByBoard_Id(postId);

        // 8. 삭제할 파일 처리
        if (filesToDeleteIds != null && !filesToDeleteIds.isEmpty()) {
            for (Long fileId : filesToDeleteIds) {
                Optional<BoardFileEntity> optionalFile = boardFileRepository.findById(fileId);
                if (optionalFile.isPresent()) {
                    BoardFileEntity file = optionalFile.get();
                    try {
                        String savedFilename = Paths.get(URI.create(file.getPath()).getPath()).getFileName().toString();
                        deleteFile(uploadDir, savedFilename);
                    } catch (Exception e) {
                        System.err.println("첨부파일 삭제 실패: " + file.getPath());
                        e.printStackTrace();
                    }

                    boardFileRepository.delete(file);
                }
            }
        }

        // 9. 새 첨부파일 저장
        if (files != null) {
            for (MultipartFile multipartFile : files) {
                if (!multipartFile.isEmpty()) {
                    String savedFilename = saveFile(uploadDir, multipartFile);

                    String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                            .path("/uploads/")
                            .path(savedFilename)
                            .toUriString();

                    BoardFileEntity newFileEntity = new BoardFileEntity();
                    newFileEntity.setBoard(board);
                    newFileEntity.setOriginalName(multipartFile.getOriginalFilename());
                    newFileEntity.setSavedName(savedFilename);
                    newFileEntity.setPath("/uploads/" + savedFilename);
                    newFileEntity.setSize(Long.valueOf(multipartFile.getSize()));
                    newFileEntity.setFileType(multipartFile.getContentType());

                    boardFileRepository.save(newFileEntity);
                }
            }
        }
    }


    // 파일 저장 메서드
    private String saveFile(String dir, MultipartFile multipartFile) throws IOException {
        String originalFilename = multipartFile.getOriginalFilename();
        String fileExtension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String savedFilename = UUID.randomUUID().toString() + fileExtension;
        Path targetLocation = Paths.get(dir).resolve(savedFilename);
        Files.copy(multipartFile.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        return savedFilename;
    }

    // 파일 삭제 메서드
    private void deleteFile(String dir, String savedFilename) {
        if (savedFilename == null || savedFilename.trim().isEmpty()) {
            System.err.println("삭제 대상 파일명이 없습니다.");
            return;
        }
        Path filePath = Paths.get(dir).resolve(savedFilename);
        try {
            if (Files.exists(filePath)) {
                if (Files.isRegularFile(filePath)) {
                    Files.delete(filePath);
                    System.out.println("파일 삭제 성공: " + filePath);
                } else {
                    System.err.println("삭제 대상이 파일이 아닙니다: " + filePath);
                }
            } else {
                System.err.println("삭제 대상 파일이 존재하지 않습니다: " + filePath);
            }
        } catch (IOException e) {
            System.err.println("파일 삭제 중 오류 발생: " + filePath.toString());
            e.printStackTrace();
        }
    }


}
