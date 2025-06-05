package com.example.cafe_lab.cafeInfo.Repository;

import com.example.cafe_lab.cafeInfo.Entity.CafeImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CafeImageRepository extends JpaRepository<CafeImage, Long> {
    void deleteByImgNameIn(List<String> imgNames);
}


