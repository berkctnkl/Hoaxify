package com.example.demo.controller;

import com.example.demo.annotation.CurrentUserDetails;
import com.example.demo.dto.CreateUserRequest;
import com.example.demo.dto.HoaxDto;
import com.example.demo.dto.UpdateUserRequest;
import com.example.demo.dto.UserDto;
import com.example.demo.exception.ApiException;
import com.example.demo.model.User;
import com.example.demo.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;


import javax.validation.Valid;
import java.util.HashMap;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/1.0/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody CreateUserRequest createUserRequest) {
        userService.save(createUserRequest);
        return ResponseEntity.ok().body("User Created");
    }

    @GetMapping
    public Page<UserDto> getAllUsers(Pageable page, @CurrentUserDetails User userDetails){
        return userService.getAllUsers(page,userDetails).map(UserDto::converter);

    }

    @GetMapping("/{username}")
    public UserDto findByUsername(@PathVariable String username){
        return UserDto.converter(userService.findByUsername(username));
    }

    @PutMapping("/{username}")
    @PreAuthorize("#username==principal.username")
    public UserDto updateUser(@Valid @RequestBody UpdateUserRequest updateUserRequest, @PathVariable String username){
        return UserDto.converter(userService.updateUser(updateUserRequest,username));

    }

    @GetMapping("/{username}/hoaxes")
    public Page<HoaxDto> getUserHoaxes(@PageableDefault(sort = "id",direction = Sort.Direction.DESC) Pageable page, @PathVariable String username){
        User user=userService.findByUsername(username);
        return userService.getUserHoaxes(page,user).map(HoaxDto::converter);
    }

    @GetMapping("/{username}/hoaxes/{id:[0-9]+}")
    public ResponseEntity<?> getUserHoaxesRelative(@PageableDefault(sort = "id",direction = Sort.Direction.DESC) Pageable page,
                                               @RequestParam(name ="count",defaultValue = "false",required = false) boolean count,
                                               @PathVariable String username,@PathVariable Long id,
                                                @RequestParam(name="direction",required = false,defaultValue = "before") String direction){
        User user=userService.findByUsername(username);
        if(count){
            long newHoaxCount=userService.getUserNewHoaxCount(user,id);
            Map<String,Long> response=new HashMap<>();
            response.put("count",newHoaxCount);
            return ResponseEntity.ok(response);
        }
        if (direction.equals("after")) {
            List<HoaxDto> newUserHoaxes=userService.getNewUserHoaxes(id, user,page.getSort()).
                    stream().map(HoaxDto::converter).collect(Collectors.toList());
            return ResponseEntity.ok(newUserHoaxes);
        }
        return ResponseEntity.ok( userService.getOldUserHoaxes(page,user,id).map(HoaxDto::converter));
    }

    @DeleteMapping("/{username}")
    @PreAuthorize("#username==principal.username")
    public ResponseEntity<?> deleteUser(@PathVariable String username){

        userService.deleteUser(username);
        return ResponseEntity.ok("User removed");
    }



    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiException validationExceptionHandler(MethodArgumentNotValidException ex){
        ApiException exception=new ApiException(400,"Validation Exception","api/1.0/users");
        Map<String,String> validationExceptions=new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(t->validationExceptions.put(t.getField(),t.getDefaultMessage()));
        exception.setValidationExceptions(validationExceptions);
        return exception;
    }

}