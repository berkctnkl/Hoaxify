package com.example.demo.dto;

import com.example.demo.model.Hoax;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.Date;

@Data
public class HoaxDto {
private Long id;
private String content;
private Date createDate;
private UserDto user;
@JsonProperty("fileAttachment")
private FileAttachmentDto fileAttachmentDto;
public static HoaxDto converter(Hoax hoax){
    HoaxDto hoaxDto=new HoaxDto();
    UserDto userDto=UserDto.converter(hoax.getUser());
    hoaxDto.setId(hoax.getId());
    hoaxDto.setContent(hoax.getContent());
    hoaxDto.setCreateDate(hoax.getCreateDate());
    hoaxDto.setUser(userDto);
    if(hoax.getFileAttachment()!=null){
        FileAttachmentDto fileAttachmentDto=FileAttachmentDto.converter(hoax.getFileAttachment());
        hoaxDto.setFileAttachmentDto(fileAttachmentDto);
    }

    return hoaxDto;
}

}
