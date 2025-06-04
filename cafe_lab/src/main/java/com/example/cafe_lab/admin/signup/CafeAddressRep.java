package com.example.cafe_lab.admin.signup;

import com.example.cafe_lab.admin.CafeAddress;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CafeAddressRep extends JpaRepository<CafeAddress, Long> {
    @Modifying
    @Transactional
    @Query("DELETE FROM CafeAddress ca WHERE ca.user.u_id = :uid")
    void deleteByUserId(@Param("uid") Long uid);


}
