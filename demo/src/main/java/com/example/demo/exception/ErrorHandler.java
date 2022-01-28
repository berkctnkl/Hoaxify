package com.example.demo.exception;

import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.context.request.WebRequest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ErrorHandler implements ErrorController {

private final ErrorAttributes errorAttributes;

    public ErrorHandler(ErrorAttributes errorAttributes) {
        this.errorAttributes = errorAttributes;
    }

@RequestMapping("/error")
public ApiException handleException(WebRequest webRequest){
    Map<String,Object> attributes=errorAttributes.getErrorAttributes(webRequest,
            ErrorAttributeOptions.of(ErrorAttributeOptions.Include.MESSAGE,ErrorAttributeOptions.Include.BINDING_ERRORS));
    String message=(String) attributes.get("message");
    String path=(String) attributes.get("path");
    int status=(Integer) attributes.get("status");
    ApiException exception=new ApiException(status,message,path);
    if(attributes.containsKey("errors")){
        @SuppressWarnings("unchecked")
        List<FieldError> fieldErrors=(List<FieldError>) attributes.get("errors");
        Map<String, String> validationExceptions=new HashMap<>();
        fieldErrors.forEach(t-> validationExceptions.put(t.getField(),t.getDefaultMessage()));
        exception.setValidationExceptions(validationExceptions);
    }
        return exception;
    }


}
