package com.example.demo.controller;


import com.example.demo.dto.AuthResponse;
import com.example.demo.dto.Credentials;


import com.example.demo.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
public class AuthController {
private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;

    }

    @PostMapping("api/1.0/auth")
    public AuthResponse authHandler(@RequestBody Credentials credentials){
        return authService.authenticate(credentials);

    }


    @PostMapping("api/1.0/logout")
    public ResponseEntity<?> logoutHandler(@RequestHeader(name="Authorization") String authorization){
        String token=authorization.substring(7);
        authService.clearToken(token);
        return ResponseEntity.ok("Logout success");
    }
}
