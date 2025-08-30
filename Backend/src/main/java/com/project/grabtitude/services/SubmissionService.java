package com.project.grabtitude.services;

import com.project.grabtitude.dto.HeatmapDataDto;
import com.project.grabtitude.entity.Submission;
import com.project.grabtitude.entity.User;
import com.project.grabtitude.repository.SubmissionRepo;
import com.project.grabtitude.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SubmissionService {
    
    @Autowired
    private SubmissionRepo submissionRepo;
    
    @Autowired
    private UserRepo userRepo;
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    
    /**
     * Get heatmap data for a user (last 365 days)
     * Returns data in format: [{ date: "YYYY-MM-DD", count: number }]
     */
    public List<HeatmapDataDto> getUserHeatmapData(String userId) {
        Optional<User> userOpt = userRepo.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + userId);
        }
        
        User user = userOpt.get();
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(364); // 365 days total
        LocalDateTime startDateTime = startDate.atStartOfDay();
        
        // Get submissions count by date
        List<Object[]> submissionCounts = submissionRepo.getSubmissionCountByDate(user, startDateTime);
        
        // Convert to map for easy lookup
        Map<LocalDate, Integer> dateCountMap = submissionCounts.stream()
            .collect(Collectors.toMap(
                row -> {
                    Object dateObj = row[0];
                    if (dateObj instanceof LocalDate) {
                        return (LocalDate) dateObj;
                    } else if (dateObj instanceof java.sql.Date) {
                        return ((java.sql.Date) dateObj).toLocalDate();
                    } else {
                        return LocalDate.parse(dateObj.toString());
                    }
                },
                row -> ((Number) row[1]).intValue()
            ));
        
        // Generate complete 365 days with counts
        List<HeatmapDataDto> heatmapData = new ArrayList<>();
        LocalDate currentDate = startDate;
        
        while (!currentDate.isAfter(endDate)) {
            String dateStr = currentDate.format(DATE_FORMATTER);
            Integer count = dateCountMap.getOrDefault(currentDate, 0);
            
            heatmapData.add(new HeatmapDataDto(dateStr, count));
            currentDate = currentDate.plusDays(1);
        }
        
        return heatmapData;
    }
    
    /**
     * Get recent submissions for a user
     */
    public List<Submission> getUserRecentSubmissions(String userId, int limit) {
        Optional<User> userOpt = userRepo.findById(userId);
        if (userOpt.isEmpty()) {
            return new ArrayList<>();
        }
        
        User user = userOpt.get();
        LocalDateTime endDateTime = LocalDateTime.now();
        LocalDateTime startDateTime = endDateTime.minusDays(30); // Last 30 days
        
        return submissionRepo.findByUserAndSubmittedAtBetweenOrderBySubmittedAtDesc(user, startDateTime, endDateTime);
    }
    
    /**
     * Get user statistics for dashboard
     */
    public Map<String, Object> getUserStats(String userId) {
        Optional<User> userOpt = userRepo.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + userId);
        }
        
        User user = userOpt.get();
        LocalDateTime endDateTime = LocalDateTime.now();
        LocalDateTime startDateTime = endDateTime.minusDays(364);
        
        List<Object[]> submissionCounts = submissionRepo.getSubmissionCountByDate(user, startDateTime);
        
        // Calculate total submissions
        int totalSubmissions = submissionCounts.stream()
            .mapToInt(row -> ((Number) row[1]).intValue())
            .sum();
        
        // Calculate active days
        int activeDays = (int) submissionCounts.stream()
            .filter(row -> ((Number) row[1]).intValue() > 0)
            .count();
        
        // Calculate current streak (consecutive days with submissions)
        int currentStreak = calculateCurrentStreak(user, endDateTime);
        
        return Map.of(
            "totalSubmissions", totalSubmissions,
            "activeDays", activeDays,
            "currentStreak", currentStreak
        );
    }
    
    /**
     * Calculate current streak (consecutive days with submissions)
     */
    private int calculateCurrentStreak(User user, LocalDateTime endDateTime) {
        int streak = 0;
        LocalDate currentDate = endDateTime.toLocalDate();
        
        while (currentDate.isAfter(endDateTime.toLocalDate().minusDays(365))) {
            LocalDateTime startOfDay = currentDate.atStartOfDay();
            LocalDateTime endOfDay = currentDate.atTime(23, 59, 59);
            
            boolean hasSubmission = submissionRepo.findByUserAndSubmittedAtBetweenOrderBySubmittedAtDesc(
                user, startOfDay, endOfDay).size() > 0;
            
            if (hasSubmission) {
                streak++;
                currentDate = currentDate.minusDays(1);
            } else {
                break;
            }
        }
        
        return streak;
    }
}
