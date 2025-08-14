package com.project.grabtitude.services;

import com.project.grabtitude.dto.ProfileResponseDto;
import com.project.grabtitude.dto.UserRegistrationDto;
import com.project.grabtitude.dto.UserResponseDto;

public interface UserService {
    UserResponseDto saveUser(UserRegistrationDto userRegistrationDto);

    UserResponseDto updateUser(UserRegistrationDto userRegistrationDto);

    UserResponseDto getUserByEmail(String email);

    UserResponseDto getUserById(String id);

    UserResponseDto deleteUser();

    UserResponseDto saveAdmin(UserRegistrationDto userRegistrationDto);

    ProfileResponseDto getProfile(String id);
}
