package com.example.cafe_lab.admin.AdminPage;

import com.example.cafe_lab.admin.Users;
import com.example.cafe_lab.admin.AdminPage.APRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/my-page")
public class MypageController {

    @Autowired
    private APRepository apRepository;

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteMyAccount(Authentication authentication) {
        // JWT 토큰에서 꺼낸 userid (username)
        String userid = authentication.getName();

        Users user = apRepository.findByUserid(userid);
        if (user != null) {
            apRepository.delete(user);
            return ResponseEntity.ok("회원 탈퇴가 완료되었습니다.");
        } else {
            return ResponseEntity.status(404).body("회원 정보를 찾을 수 없습니다.");
        }
    }
}

