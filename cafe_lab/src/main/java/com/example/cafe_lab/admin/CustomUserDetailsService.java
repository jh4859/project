package com.example.cafe_lab.admin;

import com.example.cafe_lab.admin.Users;
import com.example.cafe_lab.admin.lognin.LoginRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final LoginRepository loginRepository;

    public CustomUserDetailsService(LoginRepository loginRepository) {
        this.loginRepository = loginRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String userid) throws UsernameNotFoundException {
        System.out.println("Trying to load user: " + userid);

        Users user = loginRepository.findByUserid(userid)
                .orElseThrow(() -> {
                    System.out.println("User not found in DB: " + userid);
                    return new UsernameNotFoundException("User not found");
                });

        System.out.println("Loaded user: " + user.getUserid() + ", type: " + user.getUserType());

        // 역할 설정
        String role = "";
        if (user.getUserType() == 0) {
            role = "USER";
        } else if (user.getUserType() == 1) {
            role = "CAFE_OWNER";
        } else if (user.getUserType() == 3) {
            role = "ADMIN";
        }

        // UserDetails 객체 생성 및 반환
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUserid())
                .password(user.getPassword())
                .roles(role)  // 역할 설정
                .build();
    }

}
