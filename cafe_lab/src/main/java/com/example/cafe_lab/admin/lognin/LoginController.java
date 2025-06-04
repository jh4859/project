package com.example.cafe_lab.admin.lognin;

import com.example.cafe_lab.admin.JwtUtil;
import com.example.cafe_lab.admin.Users;
import com.example.cafe_lab.admin.signup.SignupRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import com.example.cafe_lab.admin.PasswordChange.PasswordChangeRequest;

import java.util.HashMap;
import java.util.Map;


@Controller
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class LoginController {

    @Autowired
    private LoginService loginService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String userid = loginRequest.getUserid();
        String password = loginRequest.getPassword();

        System.out.println("📥 로그인 요청 들어옴");
        System.out.println("📌 userid: " + loginRequest.getUserid());
        System.out.println("📌 password: " + loginRequest.getPassword());

        Users user = loginService.login(userid, password); // boolean → User 객체로 수정

        if (user != null) {

            //JWT 토큰 생성
            String token = JwtUtil.generateToken(userid);

            // ✅ 콘솔에 출력
            System.out.println("✅ JWT 생성 완료: " + token);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "로그인 성공");
            response.put("userType", user.getUserType()); // userType: 0, 1, 3
            response.put("token", token); // 토큰 추가!
            response.put("userid", user.getUserid()); // 로그인한 사용자 ID를 추가
            response.put("nickname", user.getNickname()); // 로그인한 사용자 닉네임 추가
            response.put("name", user.getUsername()); // 로그인한 사용자 이름 추가
            response.put("email", user.getEmail()); // 로그인한 사용자 이메일 추가

            return ResponseEntity.ok(response);
        } else {
            // ❌ 실패 시 메시지를 JSON으로!
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "아이디 또는 비밀번호가 틀렸습니다.");
            return ResponseEntity.status(401).body(errorResponse);
        }

    }


    // 비밀번호 확인 API 추가
    @PostMapping("/check-password")
    public ResponseEntity<?> checkPassword(@RequestHeader("Authorization") String token,
                                           @RequestBody Map<String, String> body) {
        // "Bearer " 접두어 제거
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        String password = body.get("password");
        String userid = JwtUtil.getUseridFromToken(token); // JWT에서 사용자 ID 추출

        // LoginService를 통해 사용자 조회
        Users user = loginService.getUserByUserid(userid); // LoginService의 getUserByUserid 메서드 호출
        if (user != null) {
            // 암호화된 비밀번호 비교
            if (passwordEncoder.matches(password, user.getPassword())) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "비밀번호 일치");
                return ResponseEntity.ok(response);
            } else {
                // 비밀번호가 틀리다면
                Map<String, String> response = new HashMap<>();
                response.put("message", "비밀번호 틀림");
                return ResponseEntity.status(401).body(response);
            }
        } else {
            // 사용자 없음
            Map<String, String> response = new HashMap<>();
            response.put("message", "사용자를 찾을 수 없습니다.");
            return ResponseEntity.status(404).body(response);
        }
    }



    // 비밀번호 변경 API
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestHeader("Authorization") String token,
            @RequestBody PasswordChangeRequest request
    ) {
        // Bearer 토큰 앞부분 제거
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        String userid = JwtUtil.getUseridFromToken(token);
        Users user = loginService.getUserByUserid(userid);

        // 토큰으로 사용자 정보 조회
        if (user == null) {
            return ResponseEntity.status(404).body(createMessage("사용자를 찾을 수 없습니다."));
        }

        // 현재 비밀번호 일치 확인 (암호화된 비밀번호와 비교)
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body(createMessage("현재 비밀번호가 틀렸습니다."));
        }

        // 새 비밀번호를 암호화하여 저장
        String encodedNewPassword = passwordEncoder.encode(request.getNewPassword());
        user.setPassword(encodedNewPassword);  // 새 암호화된 비밀번호 설정

        loginService.updateUser(user); // DB에 반영 (LoginService에 saveUser 메서드 필요)

        return ResponseEntity.ok(createMessage("비밀번호가 성공적으로 변경되었습니다."));
    }

    // 사용자 정보 수정 API
    @PutMapping("/user/update")
    public ResponseEntity<?> updateUser(
            @RequestHeader("Authorization") String token,
            @RequestBody Map<String, Object> updatedUserData) {

        // JWT 토큰에서 사용자 ID 추출
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        String userid = JwtUtil.getUseridFromToken(token); // 토큰에서 사용자 ID 추출
        Users user = loginService.getUserByUserid(userid); // 사용자 조회

        if (user == null) {
            return ResponseEntity.status(404).body(createMessage("사용자를 찾을 수 없습니다."));
        }

        // 수정된 사용자 정보 처리
        String newName = (String) updatedUserData.get("name");
        String newNickname = (String) updatedUserData.get("nickname");
        String newEmail = (String) updatedUserData.get("email");

        // 현재 이메일과 새 이메일이 같으면 중복 체크하지 않음
        if (!user.getEmail().equals(newEmail)) {
            // 새 이메일이 기존 이메일과 다르면 이메일 중복 체크
            if (loginService.isEmailDuplicated(newEmail)) {
                return ResponseEntity.status(400).body(createMessage("이미 사용 중인 이메일입니다."));
            }
        }

        // 닉네임 중복 체크 (자기 자신과 중복될 경우 제외)
        if (!newNickname.equals(user.getNickname()) && loginService.isNicknameDuplicated(newNickname)) {
            return ResponseEntity.status(400).body(createMessage("이미 사용 중인 닉네임입니다."));
        }

        // 사용자 정보를 업데이트
        user.setUsername(newName);
        user.setNickname(newNickname);
        user.setEmail(newEmail);

        // DB에 수정된 사용자 정보 저장
        loginService.updateUser(user);

        // 응답 메시지
        return ResponseEntity.ok(createMessage("회원 정보가 성공적으로 수정되었습니다."));
    }

    // 사용자 정보조회
    @GetMapping("/user")
    public ResponseEntity<?> getUserInfo(@RequestHeader("Authorization") String token) {
        // JWT 토큰에서 사용자 ID 추출
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }

        String userid = JwtUtil.getUseridFromToken(token); // 토큰에서 사용자 ID 추출
        Users user = loginService.getUserByUserid(userid); // 사용자 조회

        if (user == null) {
            return ResponseEntity.status(404).body(createMessage("사용자를 찾을 수 없습니다."));
        }

        // 사용자 정보를 응답으로 반환
        Map<String, Object> response = new HashMap<>();
        response.put("name", user.getUsername());
        response.put("nickname", user.getNickname());
        response.put("email", user.getEmail());

        return ResponseEntity.ok(response); // 성공적으로 사용자 정보 반환
    }







    // 공통 메시지 생성 메서드
    private Map<String, String> createMessage(String msg) {
        Map<String, String> map = new HashMap<>();
        map.put("message", msg);
        return map;
    }

}

