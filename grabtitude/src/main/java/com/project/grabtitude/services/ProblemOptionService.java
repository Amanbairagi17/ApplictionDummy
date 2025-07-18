package com.project.grabtitude.services;


import com.project.grabtitude.dto.ProblemOptionDto;
import com.project.grabtitude.entity.Problem;

import java.util.List;

public interface ProblemOptionService {
    List<ProblemOptionDto> getOptionForProblem(Problem problem);
}
