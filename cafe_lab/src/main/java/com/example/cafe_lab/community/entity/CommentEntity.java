package com.example.cafe_lab.community.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "comments")
public class CommentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "codId")
    @JsonBackReference
    private BoardEntity board;

    private String nickname;

    @Column(columnDefinition = "TEXT")
    private String comment;

    @Column(name = "reg_date")
    private LocalDateTime createdAt;  // 작성 시간

    @Column(name = "mod_date")
    private LocalDateTime updatedAt;  // 수정 시간

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @JsonBackReference
    public BoardEntity getCommunityData() { //순환 참조를 방지
        return board;
    }
}
