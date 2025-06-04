package com.example.cafe_lab.cafeInfo.Entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "cafe_hours")
public class CafeHours{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cah_id")
    private Long id;


    @Column(nullable = false, name = "day_of_week")
    private String day;  // 예: 월요일, 화요일 등

    @Column(nullable = false, name = "hours")
    private String hours;  // 예: 09:00 - 18:00

    // 기본 생성자
    public CafeHours() {}


    @ManyToOne
    @JoinColumn(name = "cad_id")  // 외래키 설정
    @JsonBackReference            // 무한 순환 참조 방지
    private CafeUploadEntity cafe; // CafeUploadEntity를 참조하는 필드

}

