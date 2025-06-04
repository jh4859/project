package com.example.cafe_lab.community.repository;

import com.example.cafe_lab.community.entity.CommentEntity;
import com.example.cafe_lab.community.entity.BoardEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Long> {
    List<CommentEntity> findByNickname(String nickname);

    List<CommentEntity> findByBoard_Id(Long postId);

    void deleteByBoard_Id(Long id);
}
