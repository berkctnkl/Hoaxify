package com.example.demo.annotation;

import com.example.demo.service.FileService;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Arrays;
import java.util.stream.Collectors;

public class FileTypeValidator implements ConstraintValidator<FileType,String> {
    private final FileService fileService;
    private String[] types;


    public FileTypeValidator(FileService fileService) {
        this.fileService = fileService;
    }

    @Override
    public void initialize(FileType constraintAnnotation){
        this.types=constraintAnnotation.types();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext constraintValidatorContext) {
        if(value==null){
            return true;
        }
        String fileType=fileService.detectType(value);
        return Arrays.stream(types).anyMatch(fileType::contains);
    }


}
