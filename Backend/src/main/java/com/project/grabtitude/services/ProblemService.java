package com.project.grabtitude.services;


import com.project.grabtitude.dto.ProblemRequestDto;
import com.project.grabtitude.dto.ProblemResponseDto;
import com.project.grabtitude.dto.ProblemUpdateDto;
import com.project.grabtitude.helper.CustomPageResponse;
import org.springframework.data.domain.Page;

public interface ProblemService {
    ProblemResponseDto createProblem(ProblemRequestDto problemRequestDto);

    void deleteProblemById(Long id);

    ProblemResponseDto getById(Long id);

    ProblemResponseDto update(ProblemUpdateDto problemUpdateDto);

    CustomPageResponse<ProblemResponseDto> getProblems(int page, int size);

    CustomPageResponse<ProblemResponseDto> search(String keyword, int page, int size);
}
