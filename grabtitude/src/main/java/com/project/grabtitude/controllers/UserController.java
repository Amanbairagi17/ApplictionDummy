package com.project.grabtitude.controllers;

import com.project.grabtitude.dto.UserRegistrationDto;
import com.project.grabtitude.dto.UserResponseDto;
import com.project.grabtitude.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/user/")
public class UserController {
    private final UserService userServices;
    public UserController(UserService userServices){
        this.userServices = userServices;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDto> getUser(@PathVariable String id){
        UserResponseDto user = userServices.getUserById(id);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<UserResponseDto> deleteUser(){
        UserResponseDto user = userServices.deleteUser();
        return new ResponseEntity<>(user, HttpStatus.NO_CONTENT);
    }

    @PutMapping("/update")
    public ResponseEntity<UserResponseDto> updateUser(@RequestBody UserRegistrationDto userRegistrationDto){
        UserResponseDto user = userServices.updateUser(userRegistrationDto);
        return new ResponseEntity<>(user, HttpStatus.ACCEPTED);
    }

    @GetMapping("/")
    public String userHome(){
        return "user home page view";
    }
}
