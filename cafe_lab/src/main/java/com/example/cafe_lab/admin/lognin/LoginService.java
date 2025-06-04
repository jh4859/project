package com.example.cafe_lab.admin.lognin;

import com.example.cafe_lab.admin.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class LoginService {
    @Autowired
    private LoginRepository loginRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Users login(String userid, String password) {
        Users user = loginRepository.findByUserid(userid).orElse(null);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            // 🔥 수정: 입력한 비밀번호와 암호화된 비밀번호 비교
            return user;
        }
        if (userid == null) {
            System.out.println("❌ userid는 null입니다.");
            return null;
        }
        return null;
    }

    // 추가된 사용자 조회 메서드
    public Users getUserByUserid(String userid) {
        return loginRepository.findByUserid(userid).orElse(null);
    }

    // 사용자 비밀번호 변경
    public void updateUser(Users user) {
        loginRepository.save(user);  // 비밀번호를 업데이트 후 저장
    }

    // 이메일 중복 체크 메서드
    public boolean isEmailDuplicated(String email) {
        // 이메일이 이미 존재하는지 확인
        return loginRepository.existsByEmail(email);
    }

    // 닉네임 중복 체크 메서드
    public boolean isNicknameDuplicated(String nickname) {
        // 닉네임이 이미 존재하는지 확인
        return loginRepository.existsByNickname(nickname);
    }

}