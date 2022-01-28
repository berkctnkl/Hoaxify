package com.example.demo.service;

import com.example.demo.dto.CreateUserRequest;

import com.example.demo.dto.UpdateUserRequest;

import com.example.demo.exception.NotFoundException;
import com.example.demo.model.Hoax;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;


@Service
public class UserService {
private final UserRepository userRepository;
private final PasswordEncoder passwordEncoder;
private final FileService fileService;
private final HoaxService hoaxService;

public UserService(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder, FileService fileService, HoaxService hoaxService) {
        this.userRepository = userRepository;
        this.passwordEncoder=passwordEncoder;
        this.fileService = fileService;
        this.hoaxService = hoaxService;
}


    public User save(CreateUserRequest createUserRequest){
        User user=new User();
        user.setUsername(createUserRequest.getUsername());
        user.setDisplayName(createUserRequest.getDisplayName());
        user.setPassword(passwordEncoder.encode(createUserRequest.getPassword()));

        return userRepository.save(user);
    }

    public User findByUsername(String username){
        User inDB=userRepository.findByUsername(username);
        if(inDB==null)
            throw new NotFoundException();
        return inDB;
    }
    public User updateUser(UpdateUserRequest updateUserRequest, String username){
        User inDB=findByUsername(username);
        inDB.setDisplayName(updateUserRequest.getDisplayName());
        if(updateUserRequest.getImage()!=null){
            String oldImageName=inDB.getImage();
            try {
                inDB.setImage(fileService.writeBase64EncodedStringToFile(updateUserRequest.getImage()));
            } catch (IOException e) {
                e.printStackTrace();
            }
            fileService.deleteOldFile(oldImageName);
        }
        return userRepository.save(inDB);
    }

    public Page<User> getAllUsers(Pageable page, UserDetails userDetails){
        if(userDetails!=null)
        return userRepository.findByUsernameNot(page,userDetails.getUsername());
        else
            return userRepository.findAll(page);
    }

    public Page<Hoax> getUserHoaxes(Pageable page, User user) {
        return hoaxService.getUserHoaxes(page,user);
    }

    public Page<Hoax> getOldUserHoaxes(Pageable page, User user, Long id) {
    return hoaxService.getOldUserHoaxes(page,id,user);
}

    public long getUserNewHoaxCount(User user, Long id) {
    return hoaxService.getUserNewHoaxesCount(user,id);
}

    public List<Hoax> getNewUserHoaxes(Long id, User user, Sort sort) {
    return hoaxService.getNewUserHoaxes(id,user,sort);
}

    public void deleteUser(String username) {
        User inDB=userRepository.findByUsername(username);
        fileService.deleteFilesForUser(inDB);
        userRepository.delete(inDB);

}
}
