package com.project.grabtitude.controllers;


import com.project.grabtitude.dto.ProblemResponseDto;
import com.project.grabtitude.services.ProblemService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
