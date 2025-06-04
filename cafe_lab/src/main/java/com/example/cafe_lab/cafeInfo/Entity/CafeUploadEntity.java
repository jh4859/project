package com.example.cafe_lab.cafeInfo.Entity;

import com.example.cafe_lab.admin.Users;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Entity
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
@Table(name = "cafe_data")
public class CafeUploadEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cad_id")
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String title;

    private String sns;

    @Column(nullable = false)
    private String place;

    @Column(nullable = false)
    private String content;

    @Column(nullable = false)
    private String phone;

    // 양방향
    @OneToMany(mappedBy = "cafe", cascade = CascadeType.ALL, orphanRemoval = false)
    @JsonManagedReference    // 순환 참조 문제 해결
    private List<CafeHours> cafeHours;

    // 양방향
    @OneToMany(mappedBy = "cafe", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference    // 순환 참조 문제 해결
    private List<CafeImage> images;


    @CreationTimestamp // 생성 시 자동 입력
    @Column(name = "reg_date", updatable = false)

    private LocalDateTime regDate;

    @UpdateTimestamp // 수정 시 자동 업데이트
    @Column(name = "mod_date")
    private LocalDateTime modDate;

    @Column(name = "del_date")
    private LocalDateTime delDate;

    // 승인 상태 (Enum)
    @Enumerated(EnumType.STRING)
    @Column(name = "approval_status", nullable = false)
    private CafeApprovalStatus approvalStatus = CafeApprovalStatus.PENDING;

    // 승인/거절 시각
    @Column(name = "approval_at")
    
    private LocalDateTime approvalAt;

    // Users와 연결 (ManyToOne 관계)
    @ManyToOne
    @JoinColumn(name = "u_id", nullable = false)
    @JsonBackReference  // 순환 참조 방지
    private Users user;



    // 기본 생성자 (JPA에서 꼭 필요함)
    public CafeUploadEntity() {}



    // 모든 필드를 위한 Getter/Setter
    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getPlace() { return place; }
    public void setPlace(String place) { this.place = place; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getSns() { return sns; }
    public void setSns(String sns) { this.sns = sns; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public void setImages(List<CafeImage> images) {
        this.images = images;
    }

    public void setApprovalStatus(CafeApprovalStatus approvalStatus) {
        this.approvalStatus = approvalStatus;
    }

//    public Map<String, String> getCafeHours() { return cafeHours; }
//    public void setCafeHours(Map<String, String> cafeHours) { this.cafeHours = cafeHours; }


}



