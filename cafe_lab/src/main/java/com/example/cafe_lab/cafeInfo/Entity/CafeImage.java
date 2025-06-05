package com.example.cafe_lab.cafeInfo.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Entity
@Getter
@Setter
@Table(name = "cafe_images")
public class CafeImage{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cai_id")
    private Long id;

    @Column(name = "cafe_img_url")
    private String imgURL;

    @Column(name = "cafe_img_name")
    private String imgName;

    @Column(name = "cafe_img_type")
    private String imgType;  // 이미지 타입 (예: jpg, png)

    @Column(name = "cafe_img_size")
    private Long imgSize;   // 이미지 크기 (바이트 단위)

    public CafeImage() {}

    public CafeImage(String imgURL, String imgName, String imgType, Long imgSize) {
        this.imgURL = imgURL;
        this.imgName = imgName;
        this.imgType = imgType;
        this.imgSize = imgSize;
    }


    @ManyToOne
    @JoinColumn(name = "cad_id")  // 외래키 설정
    @JsonBackReference      // 순환 참조 문제 해결
    private CafeUploadEntity cafe; // CafeUploadEntity를 참조하는 필드
}


