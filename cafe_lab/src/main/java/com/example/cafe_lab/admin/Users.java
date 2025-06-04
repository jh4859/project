package com.example.cafe_lab.admin;

import com.example.cafe_lab.cafeInfo.Entity.CafeUploadEntity;
import com.example.cafe_lab.community.entity.BoardEntity;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Getter
@Setter
@Table(name = "users")
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long u_id;

    // 사용자 아이디
    @Column(nullable = false, unique = true, length = 50)
    private String userid;

    // 이름
    @Column(nullable = false, length = 50)
    private String username;

    // 이메일
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    // 닉네임
    @Column(nullable = false,  unique = true, length = 20)
    private String nickname;

    // 비밀번호
    @Column(nullable = false, length = 255)
    private String password;

    // 회원 분류
    @Column(nullable = false)
    private Integer userType;

    // 가입일자
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }


    // CafeUploadEntity와 양방향 연결
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonManagedReference           // 순환 참조 문제 해결
    private List<CafeUploadEntity> cafes = new ArrayList<>();

    // BoardEntity와 양방향 연결
    @OneToMany(mappedBy = "user")
    @JsonManagedReference
    private List<BoardEntity> boards;


}
