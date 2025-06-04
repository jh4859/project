package com.example.cafe_lab.admin.AdminPage;

import com.example.cafe_lab.admin.Users;
import com.example.cafe_lab.admin.signup.CafeAddressRep;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class APController {

    @Autowired
    private APRepository apRepository;

    @Autowired
    private CafeAddressRep cafeAddressRep;

    //  userType이 0인 회원 목록 반환
    @GetMapping()
    public List<Users> getUsersByType(@RequestParam int userType) {
        return apRepository.findByUserType(userType);
    }

    // ✅ 회원 분류(userType) 수정
    @PutMapping("/{userid}")
    public ResponseEntity<String> updateUserType(@PathVariable String userid, @RequestBody Users updatedUser) {
        Users existingUser = apRepository.findByUserid(userid);
        if (existingUser != null) {
            existingUser.setUserType(updatedUser.getUserType()); // userType만 변경
            apRepository.save(existingUser);
            return ResponseEntity.ok("회원 분류가 수정되었습니다.");
        } else {
            return ResponseEntity.status(404).body("회원 정보를 찾을 수 없습니다.");
        }
    }

    // ✅ 회원 탈퇴 (삭제)
    @Transactional
    @DeleteMapping("/{userid}")
    public ResponseEntity<String> deleteUser(@PathVariable String userid) {
        Users user = apRepository.findByUserid(userid);

        if (user != null) {
            // 주소 삭제 (JPA 방식)
            cafeAddressRep.deleteByUserId(user.getU_id());

            // 사용자 삭제
            apRepository.delete(user);

            return ResponseEntity.ok("회원이 성공적으로 삭제되었습니다.");
        } else {
            return ResponseEntity.status(404).body("탈퇴 시 오류 발생하였습니다.잠시 후 다시 설정해주시길 바랍니다.");
        }
    }

    // 전체 회원 수 반환 (userType이 0 또는 1인 회원 수)
    @GetMapping("/count")
    public long getTotalMembers() {
        List<Integer> userTypes = List.of(0, 1);
        return apRepository.countByUserTypeIn(userTypes); // userType이 0 또는 1인 회원 수
    }

    // 신규 회원 수 반환 (오늘 가입한 회원 수)
    @GetMapping("/count-today")
    public long getNewMembers() {
        List<Integer> userTypes = List.of(0, 1);
        LocalDate today = LocalDate.now();
        return apRepository.countByUserTypeInAndCreatedAtAfter(userTypes, today.atStartOfDay()); // 오늘 가입한 회원 수
    }

}
