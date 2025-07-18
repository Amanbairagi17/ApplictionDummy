package com.project.grabtitude.services.impl;

import com.project.grabtitude.dto.ProblemOptionDto;
import com.project.grabtitude.entity.Problem;
import com.project.grabtitude.entity.ProblemOption;
import com.project.grabtitude.mapper.Mapper;
import com.project.grabtitude.repository.ProblemOptionRepo;
import com.project.grabtitude.services.ProblemOptionService;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProblemOptionServiceImpl implements ProblemOptionService {
    private final ProblemOptionRepo problemOptionRepo;
    private final Mapper<ProblemOption, ProblemOptionDto> problemOptionDtoMapper;
    public ProblemOptionServiceImpl(ProblemOptionRepo problemOptionRepo, Mapper<ProblemOption, ProblemOptionDto> problemOptionDtoMapper){
        this.problemOptionRepo = problemOptionRepo;
        this.problemOptionDtoMapper = problemOptionDtoMapper;
    }
    @Override
    public List<ProblemOptionDto> getOptionForProblem(Problem problem) {
        List<ProblemOption> options = problemOptionRepo.findAllByProblem(problem);
        List<ProblemOptionDto> optionDtos = new ArrayList<>();

        for(ProblemOption option : options){
            optionDtos.add(problemOptionDtoMapper.mapTo(option));
        }
        return optionDtos;
    }
}
