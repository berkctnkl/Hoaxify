package com.example.demo.service;

import com.example.demo.model.Hoax;

import com.example.demo.model.User;
import com.example.demo.repository.HoaxRepository;

import org.springframework.stereotype.Service;

@Service
public class HoaxSecurityService {
private final HoaxRepository hoaxRepository;

    public HoaxSecurityService(HoaxRepository hoaxRepository) {
        this.hoaxRepository = hoaxRepository;
    }

    public boolean isAllowedToDelete(Long id, User userDetails){
        Hoax hoax=hoaxRepository.getById(id);
        if(hoax==null){
            return false;
        }
       else return hoax.getUser().getId().equals(userDetails.getId());
    }


}
