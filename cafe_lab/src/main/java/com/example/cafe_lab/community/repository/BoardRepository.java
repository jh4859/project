package com.example.cafe_lab.community.repository;

import com.example.cafe_lab.community.entity.BoardEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BoardRepository extends JpaRepository<BoardEntity, Long> {
    @Query("SELECT b FROM BoardEntity b JOIN FETCH b.user")
    List<BoardEntity> findAllWithUser();

    // ✅ 새로 추가: 카테고리와 ID로 게시물 조회 (작성자도 같이 가져오기)
    @Query("SELECT b FROM BoardEntity b WHERE b.category = :category AND b.id = :id")
    Optional<BoardEntity> findByCategoryAndId(@Param("category") String category, @Param("id") Long id); // ✅ 정상 작동
}
