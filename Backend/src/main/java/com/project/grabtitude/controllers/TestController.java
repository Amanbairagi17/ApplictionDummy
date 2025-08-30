package com.project.grabtitude.controllers;

import com.project.grabtitude.dto.HeatmapDataDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/test")
@CrossOrigin(origins = "*")
public class TestController {
    
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    
    /**
     * Test endpoint for heatmap data
     */
    @GetMapping("/user/{userId}/heatmap")
    public ResponseEntity<List<HeatmapDataDto>> getTestHeatmapData(@PathVariable String userId) {
        List<HeatmapDataDto> heatmapData = new ArrayList<>();
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(364);
        Random random = new Random();
        
        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate)) {
            String dateStr = currentDate.format(DATE_FORMATTER);
            // Generate random submission count (0-5) with some days having no submissions
            int count = random.nextDouble() > 0.3 ? random.nextInt(6) : 0;
            
            heatmapData.add(new HeatmapDataDto(dateStr, count));
            currentDate = currentDate.plusDays(1);
        }
        
        return ResponseEntity.ok(heatmapData);
    }
    
    /**
     * Test endpoint for user stats
     */
    @GetMapping("/user/{userId}/stats")
    public ResponseEntity<Map<String, Object>> getTestUserStats(@PathVariable String userId) {
        Map<String, Object> stats = Map.of(
            "totalSubmissions", 45,
            "activeDays", 23,
            "currentStreak", 5
        );
        return ResponseEntity.ok(stats);
    }
    
    /**
     * Test endpoint for user profile
     */
    @GetMapping("/get-user-id/{userId}")
    public ResponseEntity<Map<String, Object>> getTestUser(@PathVariable String userId) {
        Map<String, Object> user = Map.of(
            "id", userId,
            "name", "Test User",
            "email", "test@example.com",
            "role", "USER",
            "maxStreak", 12,
            "institute", "Test University",
            "country", "India"
        );
        return ResponseEntity.ok(user);
    }
}
