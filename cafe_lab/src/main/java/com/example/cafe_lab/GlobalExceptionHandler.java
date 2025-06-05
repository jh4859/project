package com.example.cafe_lab;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    // NullPointerException 처리
    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<String> handleNullPointerException(NullPointerException e) {
        // 로그에 예외 메시지를 기록하고
        e.printStackTrace();
        return new ResponseEntity<>("NullPointerException이 발생했습니다. 입력값을 확인해주세요.", HttpStatus.BAD_REQUEST);
    }

    // IllegalArgumentException 처리
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgumentException(IllegalArgumentException e) {
        // 로그에 예외 메시지를 기록하고
        e.printStackTrace();
        return new ResponseEntity<>("잘못된 인자가 전달되었습니다. 입력값을 확인해주세요.", HttpStatus.BAD_REQUEST);
    }

    // JpaSystemException 처리
    @ExceptionHandler(JpaSystemException.class)
    public ResponseEntity<String> handleJpaSystemException(JpaSystemException e) {
        // 로그에 예외 메시지를 기록하고
        e.printStackTrace();
        return new ResponseEntity<>("JPA 시스템 예외가 발생했습니다. DB 연동을 확인해주세요.", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // 그 외의 예외를 처리하는 방법
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        // 예외 메시지 로깅
        e.printStackTrace();
        return new ResponseEntity<>("서버에서 알 수 없는 오류가 발생했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
