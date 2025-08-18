package com.project.grabtitude.services.impl;

import com.project.grabtitude.entity.User;
import com.project.grabtitude.repository.UserRepo;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class StreakReset {
    private final UserRepo userRepo;
    public StreakReset(UserRepo userRepo){
        this.userRepo = userRepo;
    }
    // cron format second  minute  hour  day-of-month  month  day-of-week
    // use 0 * * * * * for testing, this means every 1 minute (every time the second turn 0)
    // */10 * * * * * for every 10 seconds
    // currently using 0 0 0 * * * means mid night 12
    @Scheduled(cron = "0 0 0 * * *")
    public void resetStreak(){
        System.out.println("Streak reset running ------------------------------------------------------->");
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);
        List<User> users  = userRepo.findAll();
        for(User user : users){
            if(user.getLastSubmittedAt() != null && !user.getLastSubmittedAt().isAfter(yesterday)){
                user.setStreak(0);
            }
        }
        userRepo.saveAll(users);
    }
}
