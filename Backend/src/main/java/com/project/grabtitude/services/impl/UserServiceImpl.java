package com.project.grabtitude.services.impl;

import com.project.grabtitude.dto.UserRegistrationDto;
import com.project.grabtitude.dto.UserResponseDto;
import com.project.grabtitude.entity.User;
import com.project.grabtitude.helper.AuthUtil;
import com.project.grabtitude.mapper.Mapper;
import com.project.grabtitude.repository.UserRepo;
import com.project.grabtitude.services.UserService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {
    private UserRepo userRepo;
    private Mapper<User, UserRegistrationDto> userRegistrationMapper;
    private Mapper<User, UserResponseDto> userResponseMapper;

    private final BCryptPasswordEncoder passwordEncoder;

    private AuthUtil authUtil;
    public UserServiceImpl(UserRepo userRepo, Mapper<User, UserResponseDto> userResponseMapper,
                           Mapper<User, UserRegistrationDto> userRegistrationMapper,
                           AuthUtil authUtil, BCryptPasswordEncoder passwordEncoder
    ){
        this.userRepo = userRepo;
        this.userRegistrationMapper = userRegistrationMapper;
        this.userResponseMapper = userResponseMapper;
        this.authUtil = authUtil;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserResponseDto saveAdmin(UserRegistrationDto userRegistrationDto) {
        User user = userRegistrationMapper.mapFrom(userRegistrationDto);
        user.setUserId(UUID.randomUUID().toString());
        user.setPassword(passwordEncoder.encode(userRegistrationDto.getPassword()));
        user.setStreak(0);
        user.setRole(User.Role.ADMIN);
        User savedUser = userRepo.save(user);

        return userResponseMapper.mapTo(savedUser);
    }

    @Override
    public UserResponseDto saveUser(UserRegistrationDto userRegistrationDto) {
        User user = userRegistrationMapper.mapFrom(userRegistrationDto);
        user.setUserId(UUID.randomUUID().toString());
        user.setPassword(passwordEncoder.encode(userRegistrationDto.getPassword()));
        user.setStreak(0);

        User savedUser = userRepo.save(user);

        return userResponseMapper.mapTo(savedUser);
    }

    @Override
    public UserResponseDto getUserByEmail(String email) {
        Optional<User> userOptional = userRepo.findByEmail(email);
        if(userOptional.isEmpty()) throw new UsernameNotFoundException("user with email " + email + " not found");
        return userResponseMapper.mapTo(userOptional.get());
    }

    @Override
    public UserResponseDto getUserById(String id) {
        Optional<User> userOptional = userRepo.findById(id);
        if(userOptional.isEmpty()) throw  new UsernameNotFoundException("user with id " + id + " not found");
        return userResponseMapper.mapTo(userOptional.get());
    }

    @Override
    public UserResponseDto deleteUser() {
        String email = authUtil.getEmailOfLoggedUser();
        Optional<User> userOptional = userRepo.findByEmail(email);
        if(userOptional.isEmpty()) throw new UsernameNotFoundException("Please login and logout again");
        userRepo.delete(userOptional.get());
        return userResponseMapper.mapTo(userOptional.get());
    }

    @Override
    public UserResponseDto updateUser(UserRegistrationDto userRegistrationDto) {
        String email = authUtil.getEmailOfLoggedUser();
        if(!userRegistrationDto.getEmail().equals(email)) throw new AccessDeniedException("Please logout and login again");

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Please login and logout again"));

        user.setName(userRegistrationDto.getName());
        user.setAbout(userRegistrationDto.getAbout());

        userRepo.save(user);
        return userResponseMapper.mapTo(user);
    }
}


