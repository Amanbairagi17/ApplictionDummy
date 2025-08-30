package com.project.grabtitude.services;


import com.project.grabtitude.dto.*;
import com.project.grabtitude.entity.User;
import com.project.grabtitude.helper.CustomPageResponse;
import jakarta.persistence.criteria.CriteriaBuilder;

import java.util.List;
import java.util.Map;

public interface ProblemService {
    ProblemResponseDto createProblem(ProblemRequestDto problemRequestDto);

    void deleteProblemById(Long id);

    ProblemResponseDto getById(Long id);

    ProblemResponseDto update(ProblemUpdateDto problemUpdateDto);

    CustomPageResponse<ProblemResponseDto> getProblems(int page, int size);

    CustomPageResponse<ProblemResponseDto> search(String keyword, int page, int size);

    SubmissionResponseDto submit(SubmissionRequestDto submissionRequestDto);

    Map<String, Integer> getDifficultyStats(User user);

    Map<String, Integer> getTopicStats(User user);

    // New methods for ProblemController
    List<ProblemResponseDto> getAllProblems();
    
    ProblemResponseDto getProblemById(Long id);
    
    List<ProblemResponseDto> getProblemsByTopic(Long topicId);
    
    List<ProblemResponseDto> getProblemsByDifficulty(String difficulty);
    
    List<ProblemResponseDto> getAllProblemsForAdmin();
    
    void deleteProblem(Long id);

    // Alias for the existing update method
    default ProblemResponseDto updateProblem(ProblemUpdateDto problemUpdateDto) {
        return update(problemUpdateDto);
    }
}
