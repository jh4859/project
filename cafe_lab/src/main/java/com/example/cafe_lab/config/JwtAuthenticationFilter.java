package com.example.cafe_lab.config;

import com.example.cafe_lab.admin.CustomUserDetailsService;
import com.example.cafe_lab.admin.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(CustomUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");
        System.out.println("JWT Header: " + header);  // 헤더가 제대로 전달되었는지 확인하는 로그

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            System.out.println("Received token: " + token); // 토큰 로그

            try {
                if (JwtUtil.validateToken(token)) {
                    // 토큰이 유효하다면, 유저 아이디를 출력하여 토큰에서 정보를 잘 추출하는지 확인
                    System.out.println("JWT 유효함. 유저 아이디: " + JwtUtil.getUseridFromToken(token));

                    String userid = JwtUtil.getUseridFromToken(token);
                    UserDetails userDetails = userDetailsService.loadUserByUsername(userid);

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());

                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    // 인증 정보가 설정된 후, 로그 출력
                    System.out.println("Authentication set in SecurityContext: " + SecurityContextHolder.getContext().getAuthentication());

                } else {
                    // 유효하지 않은 토큰에 대해 401 Unauthorized 응답
                    System.out.println("JWT 토큰이 유효하지 않음");
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token");
                    return;  // 필터 체인 종료
                }
            } catch (io.jsonwebtoken.ExpiredJwtException e) {
                // 만료된 토큰 처리
                System.out.println("JWT 토큰이 만료됨");
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token expired");
                return;  // 필터 체인 종료
            } catch (Exception e) {
                // 기타 예외 처리
                System.out.println("JWT 처리 중 오류 발생: " + e.getMessage());
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token processing error");
                return;  // 필터 체인 종료
            }
        } else {
            System.out.println("JWT 토큰 없음 또는 잘못된 형식");
        }

        filterChain.doFilter(request, response);  // 필터 체인 계속 진행
    }
}



