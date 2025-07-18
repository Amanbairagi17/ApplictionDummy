package com.project.grabtitude.services;


import com.project.grabtitude.dto.ProblemRequestDto;
import com.project.grabtitude.dto.ProblemResponseDto;
import com.project.grabtitude.entity.Problem;

import java.util.List;

public interface ProblemService {
    ProblemResponseDto createProblem(ProblemRequestDto problemRequestDto);

    void deleteProblemById(Long id);

    ProblemResponseDto getById(Long id);

    ProblemResponseDto update(Long id, ProblemRequestDto problemRequestDto);

    List<Problem> getProblems();

    List<Problem> search(String keyword);
}
