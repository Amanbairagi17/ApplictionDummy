package com.project.grabtitude.services;

import com.project.grabtitude.dto.ProfileResponseDto;
import com.project.grabtitude.dto.ResetPasswordRequestDto;
import com.project.grabtitude.dto.UserRegistrationDto;
import com.project.grabtitude.dto.UserResponseDto;
import com.project.grabtitude.entity.User;

public interface UserService {
    UserResponseDto saveUser(UserRegistrationDto userRegistrationDto);

    UserResponseDto updateUser(UserRegistrationDto userRegistrationDto);

    UserResponseDto getUserByEmail(String email);

    UserResponseDto getUserById(String id);

    UserResponseDto deleteUser();

    UserResponseDto saveAdmin(UserRegistrationDto userRegistrationDto);

    ProfileResponseDto getProfile(String id);

    UserResponseDto saveUser(User user);

    Boolean resetPassword(ResetPasswordRequestDto resetPasswordRequestDto);

    UserResponseDto authenticateUser(String email, String password);
    
    User findOrCreateOAuth2User(String email, String name, String picture);
    
    User findByEmail(String email);
}
