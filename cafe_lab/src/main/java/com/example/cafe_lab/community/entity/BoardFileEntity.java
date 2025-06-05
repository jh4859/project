package com.example.cafe_lab.community.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "com_file")
public class BoardFileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="cf_id")
    private Long id;

    private String originalName;
    private String savedName;
    private String path;

    // 👇 파일 크기 추가 (바이트 단위)
    private Long size;

    // 파일 타입 (예: 'application/pdf', 'image/jpeg')
    private String fileType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "codID")
    @JsonBackReference
    private BoardEntity board;

    @JsonBackReference
    public BoardEntity getCommunityData() { //순환 참조를 방지
        return board;
    }
}
