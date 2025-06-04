package com.example.cafe_lab.admin;

import com.example.cafe_lab.admin.lognin.LoginRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminUser implements CommandLineRunner {
    @Autowired
    private LoginRepository loginRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;  // PasswordEncoder 주입

    @Override
    public void run(String... args) {
        // 관리자 아이디와 비밀번호
        String adminId = "admin";
        String adminPw = "0000";

        if (loginRepository.findByUserid(adminId).isEmpty()) {
            Users admin = new Users();
            CafeAddress adminAddress = new CafeAddress();
            admin.setUserid(adminId);
            // 비밀번호 암호화
            String encodedPassword = passwordEncoder.encode(adminPw);  // 비밀번호 암호화
            admin.setPassword(encodedPassword);  // 암호화된 비밀번호 설정
            admin.setUsername("관리자");
            admin.setEmail("admin@admin.com");
            admin.setNickname("관리자");
            admin.setUserType(3); // 관리자
            adminAddress.setPostalCode("");
            adminAddress.setAddress("");
            adminAddress.setDetailAddress("");

            loginRepository.save(admin);
            System.out.println("✅ 관리자 계정 생성 완료!");
        } else {
            System.out.println("🔒 관리자 계정 이미 있음!");
        }
    }
}