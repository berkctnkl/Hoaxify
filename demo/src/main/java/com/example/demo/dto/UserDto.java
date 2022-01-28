package com.example.demo.dto;

import com.example.demo.annotation.FileType;
import com.example.demo.model.User;
import lombok.Data;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
public class UserDto {
private String username;
@NotNull
@Size(min=4,max = 255)
private String displayName;
@FileType(types = {"jpeg","png"})
private String image;

public static UserDto converter(User user){
    UserDto userDto=new UserDto();
    userDto.setUsername(user.getUsername());
    userDto.setDisplayName(user.getDisplayName());
    userDto.setImage(user.getImage());
    return userDto;
}


}
