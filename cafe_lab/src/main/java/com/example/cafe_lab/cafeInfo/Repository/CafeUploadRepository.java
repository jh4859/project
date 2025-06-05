package com.example.cafe_lab.cafeInfo.Repository;

import com.example.cafe_lab.cafeInfo.Entity.CafeApprovalStatus;
import com.example.cafe_lab.cafeInfo.Entity.CafeUploadEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CafeUploadRepository extends JpaRepository<CafeUploadEntity, Long> {
    // 승인 상태에 맞는 카페 목록을 조회하는 메서드
    List<CafeUploadEntity> findByApprovalStatus(CafeApprovalStatus approvalStatus);
}
