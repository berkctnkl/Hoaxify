package com.example.demo.service;

import com.example.demo.dto.AuthResponse;
import com.example.demo.dto.Credentials;
import com.example.demo.dto.UserDto;
import com.example.demo.exception.AuthException;
import com.example.demo.exception.NotFoundException;
import com.example.demo.model.Token;
import com.example.demo.model.User;


import org.hibernate.proxy.HibernateProxy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;


@Service
public class AuthService {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    public AuthService(UserService userService, TokenService tokenService) {
        this.userService = userService;
        this.tokenService = tokenService;
        this.passwordEncoder=new BCryptPasswordEncoder();
    }

    public AuthResponse authenticate(Credentials credentials) {
        User inDB;
        try {
            inDB=userService.findByUsername(credentials.getUsername());
        }catch (NotFoundException e){
            throw new AuthException();
        }


        boolean matches=passwordEncoder.matches(credentials.getPassword(), inDB.getPassword());
        if(!matches){
            throw new AuthException();
        }

        UserDto userDto= UserDto.converter(inDB);
        String token=generateRandomToken();
        Token tokenEntity=new Token();
        tokenEntity.setToken(token);
        tokenEntity.setUser(inDB);
        tokenService.saveToken(tokenEntity);
        AuthResponse authResponse=new AuthResponse();
        authResponse.setUser(userDto);
        authResponse.setToken(token);
        return authResponse;
    }
    @Transactional
    public User getUserDetails(String token) {
        Token tokenEntity =tokenService.getTokenByTokenString(token);
        if(tokenEntity==null){
            return null;
        }
       return tokenEntity.getUser();
    }

    private String generateRandomToken(){
        return UUID.randomUUID().toString().replaceAll("-","");
    }

    public void clearToken(String token) {
        tokenService.deleteToken(token);
    }
}
