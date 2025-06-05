package com.example.cafe_lab.admin.AdminPage;

import com.example.cafe_lab.admin.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface APRepository extends JpaRepository<Users, Long> {
    List<Users> findByUserType(int userType);
    Users findByUserid(String userid);

    long countByUserTypeIn(List<Integer> integers); // userType이 0 또는 1인 회원 수 카운트

    // 등록일이 오늘 이후인 회원 수 카운트
    long countByUserTypeInAndCreatedAtAfter(List<Integer> integers, LocalDateTime createdAt);
}
