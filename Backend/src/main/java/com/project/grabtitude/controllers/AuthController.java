package com.project.grabtitude.controllers;

import com.project.grabtitude.dto.PendingVerificationUserRequestDto;
import com.project.grabtitude.dto.PendingVerificationUserResponseDto;
import com.project.grabtitude.dto.UserResponseDto;
import com.project.grabtitude.helper.AppConstants;
import com.project.grabtitude.mapper.impl.VerificationRequestDto;
import com.project.grabtitude.services.PendingVerificationUserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth/")
public class AuthController {
    private final PendingVerificationUserService pendingVerificationUserService;

    public AuthController(PendingVerificationUserService pendingVerificationUserService){
        this.pendingVerificationUserService = pendingVerificationUserService;
    }

    @PostMapping("/register-user")
    public ResponseEntity<PendingVerificationUserResponseDto> createUser(@Valid @RequestBody PendingVerificationUserRequestDto pendingVerificationUserRequestDto){
        return ResponseEntity.ok().body(pendingVerificationUserService.saveUser(pendingVerificationUserRequestDto));
    }

    //The verification link will be sent to tarun's email and admin will be verified by tarun
    @PostMapping("/register-admin")
    public ResponseEntity<UserResponseDto> createAdmin(@Valid @RequestBody VerificationRequestDto verificationRequestDto){
        return null;
    }

    @GetMapping("/verify-email")
    public ResponseEntity<Boolean> verifyUser(@RequestParam(value = "token", defaultValue = AppConstants.token) String token,
                                              @RequestParam(value = "email", defaultValue = "") String email){
        return ResponseEntity.ok().body(pendingVerificationUserService.verifyUser(token, email));
    }
}















