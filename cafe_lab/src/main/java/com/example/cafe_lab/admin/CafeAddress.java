package com.example.cafe_lab.admin;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Data
@Entity
@Getter
@Setter
@Table(name = "cafe_address")
public class CafeAddress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long adr_id;

    @OneToOne
    @JoinColumn(name = "u_id", referencedColumnName = "u_id")
    private Users user;

    private String postalCode;
    private String address;
    private String detailAddress;

    @Column(nullable = false, updatable = false)
    private LocalDateTime reg_date; // 등록 날짜

    private LocalDateTime mod_date; // 수정 날짜

    private LocalDateTime del_date; // 삭제 날짜

    // 엔티티가 생성될 때 자동으로 reg_date가 설정되도록
    @PrePersist
    public void onCreate() {
        this.reg_date = LocalDateTime.now();
    }

    // 수정할 때 mod_date가 자동으로 설정되도록
    @PreUpdate
    public void onUpdate() {
        this.mod_date = LocalDateTime.now();
    }

}
