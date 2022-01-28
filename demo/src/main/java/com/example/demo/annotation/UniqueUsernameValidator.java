package com.example.demo.annotation;

import com.example.demo.controller.UserController;
import com.example.demo.dto.UserDto;
import com.example.demo.model.User;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class UniqueUsernameValidator implements ConstraintValidator<UniqueUsername,String> {

    private final UserController userController;

    public UniqueUsernameValidator(UserController userController) {
        this.userController = userController;
    }


    @Override
    public boolean isValid(String username, ConstraintValidatorContext constraintValidatorContext) {
        UserDto user=userController.findByUsername(username);
        return user == null;
    }
}
