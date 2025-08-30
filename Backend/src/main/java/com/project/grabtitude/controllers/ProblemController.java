package com.project.grabtitude.controllers;

import com.project.grabtitude.dto.ProblemRequestDto;
import com.project.grabtitude.dto.ProblemResponseDto;
import com.project.grabtitude.dto.ProblemUpdateDto;
import com.project.grabtitude.services.ProblemService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/problems/")
@CrossOrigin(originPatterns = "*", allowedHeaders = "*")
public class ProblemController {
    
    private static final Logger logger = LoggerFactory.getLogger(ProblemController.class);
    
    private final ProblemService problemService;
    
    public ProblemController(ProblemService problemService) {
        this.problemService = problemService;
    }
    
    // Public endpoints - accessible to all users
    @GetMapping("/get-problems")
    public ResponseEntity<List<ProblemResponseDto>> getAllProblems() {
        logger.info("Fetching all problems");
        List<ProblemResponseDto> problems = problemService.getAllProblems();
        return ResponseEntity.ok(problems);
    }
    
    @GetMapping("/get/{id}")
    public ResponseEntity<ProblemResponseDto> getProblemById(@PathVariable Long id) {
        logger.info("Fetching problem with id: {}", id);
        ProblemResponseDto problem = problemService.getProblemById(id);
        return ResponseEntity.ok(problem);
    }
    
    @GetMapping("/get-by-topic/{topicId}")
    public ResponseEntity<List<ProblemResponseDto>> getProblemsByTopic(@PathVariable Long topicId) {
        logger.info("Fetching problems for topic: {}", topicId);
        List<ProblemResponseDto> problems = problemService.getProblemsByTopic(topicId);
        return ResponseEntity.ok(problems);
    }
    
    @GetMapping("/get-by-difficulty/{difficulty}")
    public ResponseEntity<List<ProblemResponseDto>> getProblemsByDifficulty(@PathVariable String difficulty) {
        logger.info("Fetching problems with difficulty: {}", difficulty);
        List<ProblemResponseDto> problems = problemService.getProblemsByDifficulty(difficulty);
        return ResponseEntity.ok(problems);
    }
    
    // Admin endpoints - require admin authentication
    @PostMapping("/admin/create")
    public ResponseEntity<ProblemResponseDto> createProblem(@Valid @RequestBody ProblemRequestDto problemRequestDto) {
        logger.info("Creating new problem: {}", problemRequestDto.getTitle());
        ProblemResponseDto createdProblem = problemService.createProblem(problemRequestDto);
        return ResponseEntity.ok(createdProblem);
    }
    
    @PutMapping("/admin/update")
    public ResponseEntity<ProblemResponseDto> updateProblem(@Valid @RequestBody ProblemUpdateDto problemUpdateDto) {
        logger.info("Updating problem with id: {}", problemUpdateDto.getProblemId());
        ProblemResponseDto updatedProblem = problemService.updateProblem(problemUpdateDto);
        return ResponseEntity.ok(updatedProblem);
    }
    
    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<String> deleteProblem(@PathVariable Long id) {
        logger.info("Deleting problem with id: {}", id);
        problemService.deleteProblem(id);
        return ResponseEntity.ok("Problem deleted successfully");
    }
    
    @GetMapping("/admin/get-all")
    public ResponseEntity<List<ProblemResponseDto>> getAllProblemsForAdmin() {
        logger.info("Admin fetching all problems");
        List<ProblemResponseDto> problems = problemService.getAllProblemsForAdmin();
        return ResponseEntity.ok(problems);
    }
}
