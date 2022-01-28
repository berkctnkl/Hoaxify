package com.example.demo.dto;

import lombok.Data;

@Data
public class CreateUserRequest {
private String username;
private String displayName;
private String password;
private String image;

}
