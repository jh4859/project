package com.example.cafe_lab.community.repository;

import com.example.cafe_lab.community.entity.BoardFileEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BoardFileRepository extends JpaRepository<BoardFileEntity, Long> {

    // originalName을 기준으로 파일 조회
    Optional<BoardFileEntity> findByOriginalName(String originalName);

    // savedName을 기준으로 파일 조회 (기본적으로 제공됨)
    Optional<BoardFileEntity> findBySavedName(String savedName);

    List<BoardFileEntity> findByBoard_Id(Long postId);

}
