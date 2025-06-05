package com.example.cafe_lab.community.entity;

import com.example.cafe_lab.admin.Users;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Table(name="board")
public class BoardEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "codID")
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String textContent;

    private String category;

    @Column(name = "reg_date")
    private LocalDateTime createdAt;  // 작성 시간

    @Column(name = "mod_date")
    private LocalDateTime updatedAt;  // 수정 시간

    @Column(name = "del_date")
    private LocalDateTime deletedAt;  // 삭제 시간 (soft delete)

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<ComImgEntity> images;  // 이미지 관계 설정

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<BoardFileEntity> files;

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<CommentEntity> comments = new ArrayList<>();

    // Users와 연결 (ManyToOne 관계)
    @ManyToOne
    @JoinColumn(name = "u_id", nullable = false)
    @JsonBackReference  // 순환 참조 방지
    private Users user;
}

