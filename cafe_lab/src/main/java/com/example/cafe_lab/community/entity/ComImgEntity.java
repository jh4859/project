package com.example.cafe_lab.community.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Setter
@Getter
@Entity
@Table(name = "com_img")
public class ComImgEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="cc_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "codID")
    @JsonBackReference
    private BoardEntity board;

    private String imgName;  // 이미지 파일명
    private String imgUrl;   // 이미지 파일 URL
    private Long imgSize;    // 이미지 크기
    private String imgType;  // 이미지 파일 타입 (예: 'image/png', 'image/jpeg')

    public ComImgEntity() {

    }

    public void setBoardEntity(BoardEntity board) {
        this.board = board;
    }

    public ComImgEntity(String imgName,
                        Long imgSize,
                        String imgType,
                        String imgUrl,
                        BoardEntity board) {
        this.imgName = imgName;
        this.imgSize = imgSize;
        this.imgType = imgType;
        this.imgUrl  = imgUrl;
        this.board = board;
    }
}


