package com.example.cafe_lab.cafeInfo.Controller;

import com.example.cafe_lab.cafeInfo.Entity.CafeApprovalStatus;
import com.example.cafe_lab.cafeInfo.Entity.CafeUploadEntity;
import com.example.cafe_lab.cafeInfo.Service.CafeApprovalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cafes")
@RequiredArgsConstructor
public class CafeApprovalController {

    private final CafeApprovalService cafeApprovalService;

    // 카페 승인
    @PostMapping("/{cafeId}/approve")
    public ResponseEntity<String> approveCafe(@PathVariable Long cafeId) {
        try {
            cafeApprovalService.changeApprovalStatus(cafeId, CafeApprovalStatus.APPROVED);
            return ResponseEntity.ok("카페 승인 완료");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // 카페 거절
    @PostMapping("/{cafeId}/reject")
    public ResponseEntity<String> rejectCafe(@PathVariable Long cafeId) {
        try {
            cafeApprovalService.changeApprovalStatus(cafeId, CafeApprovalStatus.REJECTED);
            return ResponseEntity.ok("카페 거절 완료");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // 승인 대기 중인 카페 목록 가져오기
    @GetMapping("/pending")
    public ResponseEntity<List<CafeUploadEntity>> getPendingCafes() {
        try {
            List<CafeUploadEntity> pendingCafes = cafeApprovalService.getCafesByApprovalStatus(CafeApprovalStatus.PENDING);
            return ResponseEntity.ok(pendingCafes);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // 모든 카페 목록 가져오기 (승인 상태와 관계없이)
    @GetMapping("/")
    public ResponseEntity<List<CafeUploadEntity>> getAllCafes() {
        try {
            List<CafeUploadEntity> allCafes = cafeApprovalService.getAllCafes();
            return ResponseEntity.ok(allCafes);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}


