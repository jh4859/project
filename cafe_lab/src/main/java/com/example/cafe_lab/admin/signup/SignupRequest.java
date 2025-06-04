package com.example.cafe_lab.admin.signup;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SignupRequest {
    private String userid;
    private String username;
    private String email;
    private String nickname;
    private String password;
    private Integer userType;
    private String postalCode;
    private String address;
    private String detailAddress;
    private String createdAt;

    // 기본 생성자 (JSON 파싱을 위해 필요)
    public SignupRequest() {
    }

    public SignupRequest(String userid, String username, String email, String nickname, String password, Integer userType, String postalCode, String address, String detailAddress, String createdAt) {
        this.userid = userid;
        this.username = username;
        this.email = email;
        this.nickname = nickname;
        this.password = password;
        this.userType = userType;
        this.postalCode = postalCode;
        this.address = address;
        this.detailAddress = detailAddress;
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "SignupRequest{" +
                "userid='" + userid + '\'' +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                ", nickname='" + nickname + '\'' +
                ", userType='" + userType + // Integer로 수정
                ", postalCode='" + postalCode + '\'' +
                ", address='" + address + '\'' +
                ", detailAddress='" + detailAddress + '\'' +
                ", createdAt='" + createdAt + '\'' +
                '}';

    }
};