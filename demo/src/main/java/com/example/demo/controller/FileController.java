package com.example.demo.controller;

import com.example.demo.dto.FileAttachmentDto;
import com.example.demo.model.FileAttachment;
import com.example.demo.service.FileService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;



@RestController
@RequestMapping("api/1.0")
public class FileController {
private final FileService fileService;
    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("hoax-attachments")
    public FileAttachmentDto saveHoaxAttachment(MultipartFile file){
        FileAttachment fileAttachment=fileService.saveHoaxAttachment(file);
        return FileAttachmentDto.converter(fileAttachment);
    }


}
