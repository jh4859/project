package com.example.cafe_lab.admin;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/react")

public class React_Controller {

    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return new User(id, "손현우", "0000","비비빅");
    }

        class User {
            private Long id;
            private String name;
            private String pasword;
            private String nickname;

            public User(Long id, String name, String pasword, String nickname) {
                this.id = id;
                this.name = name;
                this.pasword = pasword;
                this.nickname = nickname;
            }
}
    }