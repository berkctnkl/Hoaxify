package com.example.demo.service;

import com.example.demo.model.Token;
import com.example.demo.repository.TokenRepository;
import org.springframework.stereotype.Service;

@Service
public class TokenService {
private final TokenRepository tokenRepository;


    public TokenService(TokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    public void saveToken(Token token){
        tokenRepository.save(token);
    }


    public Token getTokenByTokenString(String tokenString){
        return tokenRepository.getById(tokenString);
    }

    public void deleteToken(String token) {
   Token tokenEnttiy=tokenRepository.getById(token);
   if(tokenEnttiy!=null)
   tokenRepository.deleteById(token);
    }
}
