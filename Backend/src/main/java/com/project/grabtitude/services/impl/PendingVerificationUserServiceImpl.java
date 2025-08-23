package com.project.grabtitude.services.impl;

import com.project.grabtitude.dto.PendingVerificationUserRequestDto;
import com.project.grabtitude.dto.PendingVerificationUserResponseDto;
import com.project.grabtitude.entity.PendingVerificationUser;
import com.project.grabtitude.entity.User;
import com.project.grabtitude.mapper.impl.PendingVerificationUserRequestMapper;
import com.project.grabtitude.mapper.impl.PendingVerificationUserResponseMapper;
import com.project.grabtitude.repository.PendingVerificationUserRepo;
import com.project.grabtitude.repository.UserRepo;
import com.project.grabtitude.services.EmailService;
import com.project.grabtitude.services.PendingVerificationUserService;
import com.project.grabtitude.services.UserService;
import lombok.extern.java.Log;
import org.springframework.cglib.core.Local;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Log
@Service
public class PendingVerificationUserServiceImpl implements PendingVerificationUserService {

    private final PendingVerificationUserRepo pendingVerificationUserRepo;
    private final UserRepo userRepo;

    private final PendingVerificationUserResponseMapper pendingVerificationUserResponseMapper;
    private final UserService userService;
    private final PendingVerificationUserRequestMapper pendingVerificationUserRequestMapper;
    private final EmailService emailService;
    public PendingVerificationUserServiceImpl(PendingVerificationUserRepo pendingVerificationUserRepo,
                                              PendingVerificationUserRequestMapper pendingVerificationUserRequestMapper,
                                              PendingVerificationUserResponseMapper pendingVerificationUserResponseMapper,
                                              UserService userService, EmailService emailService,
                                              UserRepo userRepo){
        this.pendingVerificationUserRepo = pendingVerificationUserRepo;
        this.pendingVerificationUserRequestMapper = pendingVerificationUserRequestMapper;
        this.pendingVerificationUserResponseMapper = pendingVerificationUserResponseMapper;
        this.userService = userService;
        this.userRepo = userRepo;
        this.emailService = emailService;
    }
    @Override
    public PendingVerificationUserResponseDto saveUser(PendingVerificationUserRequestDto pendingVerificationUserRequestDto) {
        //If the pending user is already saved and request comes again so just update it with password
        String email = pendingVerificationUserRequestDto.getEmail();

        //If the email is already registered with some user who is in user db(the user who is verified) so don't save this
        if(userRepo.findByEmail(email).isPresent()){
            throw new RuntimeException("The email is already registered try login with you email and password");
        }

        if(this.findByEmail(email).isPresent()){
            log.info("PendingVerificationUser already exist so calling update for it");
            return this.updateUser(pendingVerificationUserRequestDto);
        }
        PendingVerificationUser pendingVerificationUser = pendingVerificationUserRequestMapper.mapFrom(pendingVerificationUserRequestDto);
        String token = UUID.randomUUID().toString();
        LocalDate currentDate = LocalDate.now();
        LocalDate expiryDate = currentDate.plusDays(3);
        pendingVerificationUser.setVerificationToken(token);
        pendingVerificationUser.setExpiryDate(expiryDate);
        PendingVerificationUser savedUser = pendingVerificationUserRepo.save(pendingVerificationUser);
        try {
            emailService.send(pendingVerificationUser.getEmail(), "Verification Email", "This the verification link for user on grabtitude please click to verify your email or if you are have received this by mistake please ignore this. http://localhost:8080/auth/verify-email?token=" + token);
        }
        catch (Exception e){
            throw new RuntimeException(e.getCause());
        }
        return pendingVerificationUserResponseMapper.mapTo(savedUser);
    }

    @Override
    public void saveVerifiedUser(PendingVerificationUser pendingVerificationUser) {
        User user = new User();
        String id = UUID.randomUUID().toString();
        user.setUserId(id);
        user.setName(pendingVerificationUser.getName());
        user.setEmail(pendingVerificationUser.getEmail());
        user.setPassword(pendingVerificationUser.getPassword());

        userService.saveUser(user);
    }

    @Override
    public PendingVerificationUserResponseDto updateUser(PendingVerificationUserRequestDto pendingVerificationUserRequestDto) {
        //although this will be only called if the user already exist as we call this by save user still checking again
        String email = pendingVerificationUserRequestDto.getEmail();
        Optional<PendingVerificationUser> userOptional = pendingVerificationUserRepo.findByEmail(email);
        if(userOptional.isEmpty()) throw new UsernameNotFoundException("No user exist with email : " + email + " which you are trying to update");

        PendingVerificationUser existingUser = userOptional.get();
        LocalDate currentDate = LocalDate.now();
        LocalDate newExpiryDate = currentDate.plusDays(3);
        String token = UUID.randomUUID().toString();

        existingUser.setName(pendingVerificationUserRequestDto.getName());
        existingUser.setPassword(pendingVerificationUserRequestDto.getPassword());
        existingUser.setExpiryDate(newExpiryDate);
        existingUser.setVerificationToken(token);

        try {
            emailService.send(email, "Verification Email for Grabtitude", "This the verification link for user on grabtitude please click to verify your email or if you are have received this by mistake please ignore this. http://localhost:8080/auth/verify-email?token=" + token);
        }
        catch (Exception e){
            throw new RuntimeException(e.getCause());
        }
        PendingVerificationUser savedUser = pendingVerificationUserRepo.save(existingUser);

        return pendingVerificationUserResponseMapper.mapTo(savedUser);
    }

    @Override
    public Optional<PendingVerificationUser> findByEmail(String email) {
        return pendingVerificationUserRepo.findByEmail(email);
    }

    @Override
    public boolean verifyUser(String token, String email) {
        PendingVerificationUser user = pendingVerificationUserRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("No user found for given email please enter the email by which you registered or please registering again"));
        if(!user.getVerificationToken().equals(token))
            throw new RuntimeException("Token and user email does not match");

        this.saveVerifiedUser(user);
        pendingVerificationUserRepo.delete(user);
        return true;
    }
}
