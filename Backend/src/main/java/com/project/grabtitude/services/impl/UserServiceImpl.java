package com.project.grabtitude.services.impl;

import com.project.grabtitude.dto.ProfileResponseDto;
import com.project.grabtitude.dto.UserRegistrationDto;
import com.project.grabtitude.dto.UserResponseDto;
import com.project.grabtitude.entity.Submission;
import com.project.grabtitude.entity.User;
import com.project.grabtitude.helper.AuthUtil;
import com.project.grabtitude.helper.ResourceNotFoundException;
import com.project.grabtitude.mapper.Mapper;
import com.project.grabtitude.repository.SubmissionRepo;
import com.project.grabtitude.repository.UserRepo;
import com.project.grabtitude.services.UserService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepo userRepo;
    private final Mapper<User, UserRegistrationDto> userRegistrationMapper;
    private final Mapper<User, UserResponseDto> userResponseMapper;
    private final SubmissionRepo submissionRepo;
    private final BCryptPasswordEncoder passwordEncoder;

    private final AuthUtil authUtil;
    public UserServiceImpl(UserRepo userRepo, Mapper<User, UserResponseDto> userResponseMapper,
                           Mapper<User, UserRegistrationDto> userRegistrationMapper,
                           AuthUtil authUtil, BCryptPasswordEncoder passwordEncoder,
                           SubmissionRepo submissionRepo
    ){
        this.userRepo = userRepo;
        this.userRegistrationMapper = userRegistrationMapper;
        this.userResponseMapper = userResponseMapper;
        this.authUtil = authUtil;
        this.passwordEncoder = passwordEncoder;
        this.submissionRepo = submissionRepo;
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

    @Override
    public ProfileResponseDto getProfile() {
        String email = authUtil.getEmailOfLoggedUser();

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Please login and logout again"));

        List<Submission> submissions = submissionRepo.findAllByUser(user);
        Set<Long> uniqueQuestions = new HashSet<>();
        Map<String, Integer> difficultyWiseQuestionsSolved = new HashMap<>();
        Map<String, Integer> topicWiseQuestionsSolved = new HashMap<>();
        double correctSubmissions = 0;

        for(Submission submission : submissions){
            if(submission.isCorrect() && !uniqueQuestions.contains(submission.getProblem().getProblemId())){
                uniqueQuestions.add(submission.getProblem().getProblemId());
                String difficulty = submission.getProblem().getDifficulty().toString();
                difficultyWiseQuestionsSolved.put(difficulty, difficultyWiseQuestionsSolved.getOrDefault(difficulty, 0)+1);

                String topic = submission.getProblem().getTopic().toString();
                topicWiseQuestionsSolved.put(topic, topicWiseQuestionsSolved.getOrDefault(topic, 0)+1);
                correctSubmissions++;
            }
        }

        double accuracy = (correctSubmissions*100) / (double) submissions.size();
        ProfileResponseDto profileResponseDto = new ProfileResponseDto();
        profileResponseDto.setName(user.getName());
        profileResponseDto.setUserId(user.getUserId());
        profileResponseDto.setAbout(user.getAbout());
        profileResponseDto.setCountry(user.getCountry());
        profileResponseDto.setInstitute(user.getInstitute());
        profileResponseDto.setLinkedIn(user.getLinkedIn());
        profileResponseDto.setGithub(user.getGithub());
        profileResponseDto.setDifficultyLevelWiseQuestionsSolved(difficultyWiseQuestionsSolved);
        profileResponseDto.setTopicWiseQuestionsSolved(topicWiseQuestionsSolved);
        profileResponseDto.setQuestionsSolved(uniqueQuestions.size());
        profileResponseDto.setAccuracy(accuracy);

        return profileResponseDto;
    }
}


