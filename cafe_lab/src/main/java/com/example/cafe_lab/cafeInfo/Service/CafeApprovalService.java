package com.example.cafe_lab.cafeInfo.Service;

import com.example.cafe_lab.cafeInfo.Entity.CafeApprovalStatus;
import com.example.cafe_lab.cafeInfo.Entity.CafeUploadEntity;
import com.example.cafe_lab.cafeInfo.Repository.CafeUploadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CafeApprovalService {

    private final CafeUploadRepository cafeUploadRepository;

    // 카페 승인/거절 상태 변경
    public void changeApprovalStatus(Long cafeId, CafeApprovalStatus approvalStatus) {
        CafeUploadEntity cafe = cafeUploadRepository.findById(cafeId)
                .orElseThrow(() -> new RuntimeException("카페를 찾을 수 없습니다."));

        // 승인 상태 변경
        cafe.setApprovalStatus(approvalStatus);

        // 승인/거절 시각 기록
        if (approvalStatus == CafeApprovalStatus.APPROVED || approvalStatus == CafeApprovalStatus.REJECTED) {
            cafe.setApprovalAt(LocalDateTime.now());  // 승인/거절 시각 설정
        }

        // 상태 변경된 카페 저장
        cafeUploadRepository.save(cafe);
    }

    // 승인 대기 중인 카페 목록을 가져오는 메서드
    public List<CafeUploadEntity> getCafesByApprovalStatus(CafeApprovalStatus status) {
        return cafeUploadRepository.findByApprovalStatus(status); // 카페 상태로 필터링
    }

    // 전체 카페 목록 가져오기 (승인 상태와 관계없이)
    public List<CafeUploadEntity> getAllCafes() {
        return cafeUploadRepository.findAll(); // 모든 카페 반환
    }
}
