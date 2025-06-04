package com.example.cafe_lab.admin.lognin;

import com.example.cafe_lab.admin.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LoginRepository extends JpaRepository <Users, Long> {
    Optional<Users> findByUserid(String userid);

    // 이메일로 존재하는지 체크
    boolean existsByEmail(String email);

    // 닉네임으로 존재하는지 체크
    boolean existsByNickname(String nickname);
}
