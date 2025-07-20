package com.project.grabtitude.controllers;


import com.project.grabtitude.dto.ProblemResponseDto;
import com.project.grabtitude.helper.AppConstants;
import com.project.grabtitude.services.ProblemService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/problems")
public class ProblemController {
    private final ProblemService problemService;
    public ProblemController(ProblemService problemService){
        this.problemService = problemService;
    }
    @GetMapping("/get/{id}")
    public ProblemResponseDto getProblem(@PathVariable Long id){
        return problemService.getById(id);
    }

    @GetMapping("/get-problems")
    public ResponseEntity<Page<ProblemResponseDto>> getProblems(@RequestParam(value = "page", defaultValue = AppConstants.page) int page,
                                                                @RequestParam(value = "size", defaultValue = AppConstants.size) int size){
        return new ResponseEntity<>(problemService.getProblems(page, size), HttpStatus.OK);
    }

}
