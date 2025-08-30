package com.project.grabtitude.controllers;

import com.project.grabtitude.dto.*;
import com.project.grabtitude.entity.Submission;
import com.project.grabtitude.helper.AppConstants;
import com.project.grabtitude.services.ProblemService;
import com.project.grabtitude.services.SubmissionService;
import com.project.grabtitude.services.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user/")
public class UserController {
    private final UserService userServices;
    private final ProblemService problemService;
    private final SubmissionService submissionService;

    public UserController(UserService userServices, ProblemService problemService, SubmissionService submissionService) {
        this.userServices = userServices;
        this.problemService = problemService;
        this.submissionService = submissionService;
    }

    @DeleteMapping("/delete")
    public ResponseEntity<UserResponseDto> deleteUser() {
        UserResponseDto user = userServices.deleteUser();
        return new ResponseEntity<>(user, HttpStatus.ACCEPTED);
    }

    @PutMapping("/update")
    public ResponseEntity<UserResponseDto> updateUser(@Valid @RequestBody UserRegistrationDto userRegistrationDto) {
        UserResponseDto user = userServices.updateUser(userRegistrationDto);
        return new ResponseEntity<>(user, HttpStatus.ACCEPTED);
    }

    @PostMapping("/submit")
    public ResponseEntity<SubmissionResponseDto> submitOption(@RequestBody SubmissionRequestDto submissionRequestDto) {
        SubmissionResponseDto submissionResponseDto = problemService.submit(submissionRequestDto);
        return new ResponseEntity<>(submissionResponseDto, HttpStatus.OK);
    }

    @PatchMapping("/reset-password")
    public ResponseEntity<Boolean> resetPassword(@Valid @RequestBody ResetPasswordRequestDto resetPasswordRequestDto) {
        return ResponseEntity.ok().body(userServices.resetPassword(resetPasswordRequestDto));
    }

    @GetMapping("/")
    public String userHome() {
        return "user home page view";
    }

    /**
     * Get heatmap data for user activity (last 365 days)
     * Returns: [{ date: "YYYY-MM-DD", count: number }]
     */
    @GetMapping("/{userId}/heatmap")
    public ResponseEntity<?> getUserHeatmapData(@PathVariable String userId) {
        try {
            List<HeatmapDataDto> heatmapData = submissionService.getUserHeatmapData(userId);
            return ResponseEntity.ok(heatmapData);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "User not found", "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Internal server error", "message", e.getMessage()));
        }
    }

    /**
     * Get user statistics for dashboard
     */
    @GetMapping("/{userId}/stats")
    public ResponseEntity<?> getUserStats(@PathVariable String userId) {
        try {
            Map<String, Object> stats = submissionService.getUserStats(userId);
            return ResponseEntity.ok(stats);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "User not found", "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Internal server error", "message", e.getMessage()));
        }
    }

    /**
     * Get user submissions for a specific date range
     */
    @GetMapping("/{userId}/submissions")
    public ResponseEntity<?> getUserSubmissions(
            @PathVariable String userId,
            @RequestParam(defaultValue = "30") int days) {
        try {
            List<Submission> submissions = submissionService.getUserRecentSubmissions(userId, days);
            return ResponseEntity.ok(submissions);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "User not found", "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Internal server error", "message", e.getMessage()));
        }
    }
}
