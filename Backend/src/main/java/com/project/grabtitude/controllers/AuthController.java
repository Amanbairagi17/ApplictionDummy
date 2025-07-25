package com.project.grabtitude.controllers;

import com.project.grabtitude.dto.UserRegistrationDto;
import com.project.grabtitude.dto.UserResponseDto;
import com.project.grabtitude.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth/")
public class AuthController {
    private UserService userServices;

    public AuthController(UserService userServices){
        this.userServices = userServices;
    }

    @PostMapping("/register-user")
    public ResponseEntity<UserResponseDto> createUser(@RequestBody UserRegistrationDto userRegistrationDto){
        UserResponseDto userResponseDto = userServices.saveUser(userRegistrationDto);
        return new ResponseEntity<>(userResponseDto, HttpStatus.CREATED);
    }


    @PostMapping("/register-admin")
    public ResponseEntity<UserResponseDto> createAdmin(@RequestBody UserRegistrationDto userRegistrationDto){
        UserResponseDto userResponseDto = userServices.saveAdmin(userRegistrationDto);
        return new ResponseEntity<>(userResponseDto, HttpStatus.CREATED);
    }
}
