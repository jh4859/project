package com.example.cafe_lab.community.repository;

import com.example.cafe_lab.community.entity.ComImgEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardImageRepository extends JpaRepository<ComImgEntity, Long> {
    List<ComImgEntity> findByBoardId(Long postId);
}
