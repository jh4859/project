package com.example.cafe_lab.admin;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {
    private static final String SECRET_KEY = "mySecretKey123456"; // ✅ 진짜 서비스라면 환경변수로 빼야 해!
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 2; // 2시간

    // 토큰 생성
    public static String generateToken(String userid) {
        return Jwts.builder()
                .setSubject(userid)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // 만료시간
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
                .compact();
    }

    // 토큰에서 userid 추출
    public static String getUseridFromToken(String token) {
        try {
            System.out.println("토큰에서 유저 아이디 추출 시작");
            String userId = Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
            System.out.println("추출된 유저 아이디: " + userId);
            return userId;
        } catch (ExpiredJwtException e) {
            // 만약 토큰이 만료된 경우
            System.out.println("만료된 토큰에서 userid 추출 시 예외 발생: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            // 다른 예외 처리
            System.out.println("토큰에서 userid 추출 실패: " + e.getMessage());
            throw e;
        }
    }


    // 토큰 유효성 검증
    public static boolean validateToken(String token) {
        try {
            System.out.println("토큰 유효성 검증 시작");
            Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token);
            System.out.println("토큰 유효성 검증 성공");
            return true;
        } catch (ExpiredJwtException e) {
            // 토큰이 만료된 경우
            System.out.println("만료된 토큰: " + e.getMessage());
        } catch (Exception e) {
            // 서명 오류나 다른 오류 발생
            System.out.println("토큰 유효성 검증 실패: " + e.getMessage());
        }
        return false;
    }
}

