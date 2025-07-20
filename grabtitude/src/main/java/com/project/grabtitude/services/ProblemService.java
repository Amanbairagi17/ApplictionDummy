package com.project.grabtitude.services;


import com.project.grabtitude.dto.ProblemRequestDto;
import com.project.grabtitude.dto.ProblemResponseDto;
import org.springframework.data.domain.Page;

public interface ProblemService {
    ProblemResponseDto createProblem(ProblemRequestDto problemRequestDto);

    void deleteProblemById(Long id);

    ProblemResponseDto getById(Long id);

    ProblemResponseDto update(Long id, ProblemRequestDto problemRequestDto);

    Page<ProblemResponseDto> getProblems(int page, int size);

    Page<ProblemResponseDto> search(String keyword, int page, int size);
}
