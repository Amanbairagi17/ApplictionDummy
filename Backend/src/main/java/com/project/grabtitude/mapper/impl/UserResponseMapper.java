package com.project.grabtitude.mapper.impl;

import com.project.grabtitude.dto.UserResponseDto;
import com.project.grabtitude.entity.User;
import com.project.grabtitude.mapper.Mapper;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class UserResponseMapper implements Mapper<User, UserResponseDto> {

    private ModelMapper modelMapper;
    public UserResponseMapper(ModelMapper modelMapper){
        this.modelMapper = modelMapper;
    }
    @Override
    public UserResponseDto mapTo(User user) {
        UserResponseDto dto = modelMapper.map(user, UserResponseDto.class);
        // Ensure role is properly converted from enum to string
        if (user.getRole() != null) {
            dto.setRole(user.getRole().toString());
        }
        return dto;
    }

    @Override
    public User mapFrom(UserResponseDto userResponseDto) {
        return modelMapper.map(userResponseDto, User.class);
    }
}
