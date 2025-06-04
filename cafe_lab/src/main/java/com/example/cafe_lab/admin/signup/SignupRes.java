package com.example.cafe_lab.admin.signup;

import com.example.cafe_lab.admin.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SignupRes extends JpaRepository<Users, Long> {
    Optional<Users> findByUsername(String username);
    Optional<Users> findByEmail(String email);
    Optional<Users> findByNickname(String nickname);
    Optional<Users> findByUserid(String userid);
}
