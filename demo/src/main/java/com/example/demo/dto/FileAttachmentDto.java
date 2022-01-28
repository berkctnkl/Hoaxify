package com.example.demo.dto;


import com.example.demo.model.FileAttachment;
import lombok.Data;

import java.util.Date;

@Data
public class FileAttachmentDto {
private Long id;
private String name;
private Date crateDate;


public static FileAttachmentDto converter(FileAttachment fileAttachment){
    FileAttachmentDto fileAttachmentDto=new FileAttachmentDto();
    fileAttachmentDto.setId(fileAttachment.getId());
    fileAttachmentDto.setName(fileAttachment.getName());
    fileAttachmentDto.setCrateDate(fileAttachment.getCreateDate());
    return fileAttachmentDto;
}


}
