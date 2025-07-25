package com.project.grabtitude.mapper.impl;

import com.project.grabtitude.dto.ProblemOptionDto;
import com.project.grabtitude.entity.ProblemOption;
import com.project.grabtitude.mapper.Mapper;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class ProblemOptionMapper implements Mapper<ProblemOption, ProblemOptionDto> {
    private ModelMapper modelMapper;
    public ProblemOptionMapper(ModelMapper modelMapper){
        this.modelMapper = modelMapper;
    }
    @Override
    public ProblemOption mapFrom(ProblemOptionDto problemOptionDto) {
        return modelMapper.map(problemOptionDto, ProblemOption.class);
    }

    @Override
    public ProblemOptionDto mapTo(ProblemOption problemOption) {
        return modelMapper.map(problemOption, ProblemOptionDto.class);
    }
}
