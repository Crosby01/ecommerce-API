package com.example.ecommerce.controller;

import com.example.ecommerce.entity.User;
import com.example.ecommerce.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.ecommerce.dto.SignupRequest;
import com.example.ecommerce.dto.SignupResponse;
import com.example.ecommerce.dto.LoginRequest;
import com.example.ecommerce.dto.LoginResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
public ResponseEntity<SignupResponse> signup(@RequestBody SignupRequest request) {

    User user = authService.signup(
        request.getName(),
        request.getEmail(),
        request.getPassword()
);

SignupResponse response = new SignupResponse(
        user.getId(),
        user.getName(),
        user.getEmail()
);

return ResponseEntity.status(201).body(response);
}

@PostMapping("/login")
public ResponseEntity<LoginResponse> login(
        @RequestBody LoginRequest request) {

    LoginResponse response = authService.login(
            request.getEmail(),
            request.getPassword()
    );

    return ResponseEntity.ok(response);
}
}

