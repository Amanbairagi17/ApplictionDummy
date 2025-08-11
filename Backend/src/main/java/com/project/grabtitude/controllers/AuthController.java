package com.project.grabtitude.controllers;

import com.project.grabtitude.dto.UserRegistrationDto;
import com.project.grabtitude.dto.UserResponseDto;
import com.project.grabtitude.services.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth/")
public class AuthController {
    private final UserService userServices;

    public AuthController(UserService userServices){
        this.userServices = userServices;
    }

    @PostMapping("/register-user")
    public ResponseEntity<UserResponseDto> createUser(@Valid @RequestBody UserRegistrationDto userRegistrationDto){
        UserResponseDto userResponseDto = userServices.saveUser(userRegistrationDto);
        return new ResponseEntity<>(userResponseDto, HttpStatus.CREATED);
    }


    @PostMapping("/register-admin")
    public ResponseEntity<UserResponseDto> createAdmin(@Valid @RequestBody UserRegistrationDto userRegistrationDto){
        UserResponseDto userResponseDto = userServices.saveAdmin(userRegistrationDto);
        return new ResponseEntity<>(userResponseDto, HttpStatus.CREATED);
    }
}















