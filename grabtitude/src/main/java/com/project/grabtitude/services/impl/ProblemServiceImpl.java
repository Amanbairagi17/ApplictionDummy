package com.project.grabtitude.services.impl;

import com.project.grabtitude.dto.ProblemOptionDto;
import com.project.grabtitude.dto.ProblemRequestDto;
import com.project.grabtitude.dto.ProblemResponseDto;
import com.project.grabtitude.entity.Problem;
import com.project.grabtitude.entity.ProblemOption;
import com.project.grabtitude.entity.Topic;
import com.project.grabtitude.helper.AppConstants;
import com.project.grabtitude.helper.CustomPageResponse;
import com.project.grabtitude.helper.ResourceNotFoundException;
import com.project.grabtitude.mapper.Mapper;
import com.project.grabtitude.repository.ProblemOptionRepo;
import com.project.grabtitude.repository.ProblemRepo;
import com.project.grabtitude.repository.TopicRepo;
import com.project.grabtitude.services.ProblemOptionService;
import com.project.grabtitude.services.ProblemService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProblemServiceImpl implements ProblemService {
    private final ProblemRepo problemRepo;
    private final Mapper<ProblemOption, ProblemOptionDto> problemOptionMapper;
    private final Mapper<Problem, ProblemResponseDto> problemResponseDtoMapper;
    private final Mapper<Problem, ProblemRequestDto> problemRequestDtoMapper;
    private final ProblemOptionRepo problemOptionRepo;
    private final TopicRepo topicRepo;
    private final ProblemOptionService problemOptionService;
    public ProblemServiceImpl(ProblemRepo problemRepo, ProblemOptionRepo problemOptionRepo,
                              Mapper<ProblemOption, ProblemOptionDto> problemOptionMapper,
                              Mapper<Problem, ProblemResponseDto> problemResponseDtoMapper,
                              Mapper<Problem, ProblemRequestDto> problemRequestDtoMapper,
                              TopicRepo topicRepo, ProblemOptionService problemOptionService
    ){
        this.problemRepo = problemRepo;
        this.problemOptionRepo = problemOptionRepo;
        this.problemOptionMapper = problemOptionMapper;
        this.problemRequestDtoMapper = problemRequestDtoMapper;
        this.problemResponseDtoMapper = problemResponseDtoMapper;
        this.topicRepo = topicRepo;
        this.problemOptionService = problemOptionService;
    }

    @Override
    public ProblemResponseDto createProblem(ProblemRequestDto problemRequestDto) {
        System.out.println(problemRequestDto);
        List<ProblemOptionDto> problemOptionDtos = problemRequestDto.getOptions();
        long topicId = problemRequestDto.getTopicId();

        Optional<Topic> topicOptional = topicRepo.findById(topicId);
        if(topicOptional.isEmpty()) throw new ResourceNotFoundException("Topic not found with id : " + topicId);
        Topic topic = topicOptional.get();

        Problem problem = problemRequestDtoMapper.mapFrom(problemRequestDto);
        problem.setTopic(topic);
        Problem savedProblem = problemRepo.save(problem);
        ProblemResponseDto problemResponseDto = problemResponseDtoMapper.mapTo(savedProblem);

        List<ProblemOptionDto> savedProblemOptionDtos = new ArrayList<>();
        for(ProblemOptionDto optionDto : problemOptionDtos){
            ProblemOption option = problemOptionMapper.mapFrom(optionDto);
            option.setProblem(savedProblem);
            ProblemOption savedOption = problemOptionRepo.save(option);
            savedProblemOptionDtos.add(problemOptionMapper.mapTo(savedOption));
        }

        problemResponseDto.setOptions(savedProblemOptionDtos);
        problemResponseDto.setTopicId(topicId);
        return problemResponseDto;
    }

    @Override
    public ProblemResponseDto getById(Long id) {
        Optional<Problem> problemOptional = problemRepo.findById(id);
        if(problemOptional.isEmpty()) throw new ResourceNotFoundException("Problem not found with problem id : " + id);
        Problem problem = problemOptional.get();
        List<ProblemOptionDto> problemOptionDtos = problemOptionService.getOptionForProblem(problem);

        ProblemResponseDto problemResponseDto = problemResponseDtoMapper.mapTo(problem);
        problemResponseDto.setOptions(problemOptionDtos);
        problemResponseDto.setTopicId(problem.getTopic().getId());
        return problemResponseDto;
    }

    @Override
    public CustomPageResponse<ProblemResponseDto> getProblems(int page, int size) {
        Sort sort = Sort.by("problemId").ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Problem> problems = problemRepo.findAll(pageable);

        //now problem is we got the page of problem from repo but we need to return page of ProblemResponseDto
        Page<ProblemResponseDto> problemResponseDtoPage = problems.map(problem -> {
            ProblemResponseDto problemResponseDto = problemResponseDtoMapper.mapTo(problem);
            List<ProblemOptionDto> problemOptionDtos = problemOptionService.getOptionForProblem(problem);
            problemResponseDto.setOptions(problemOptionDtos);
            problemResponseDto.setTopicId(problem.getTopic().getId());
            return problemResponseDto;
        });

        CustomPageResponse<ProblemResponseDto> responsePage = new CustomPageResponse<>();

        responsePage.setContent(problemResponseDtoPage.getContent());
        responsePage.setPageNumber(problemResponseDtoPage.getNumber());
        responsePage.setPageSize(problemResponseDtoPage.getSize());
        responsePage.setLast(problemResponseDtoPage.isLast());
        responsePage.setFirst(problemResponseDtoPage.isFirst());
        responsePage.setTotalPages(problemResponseDtoPage.getTotalPages());
        responsePage.setTotalNumberOfElements(problemResponseDtoPage.getTotalElements());
        responsePage.setNumberOfElements(problemResponseDtoPage.getNumberOfElements());

        return responsePage;
    }

    @Override
    public CustomPageResponse<ProblemResponseDto> search(String keyword, int page, int size) {
        return null;
    }

    @Override
    public ProblemResponseDto update(Long id, ProblemRequestDto problemRequestDto) {
        return null;
    }


    @Override
    public void deleteProblemById(Long id) {
        Optional<Problem> problemOptional = problemRepo.findById(id);
        if(problemOptional.isEmpty()) throw new ResourceNotFoundException("Problem not found with problem id : " + id);
        Problem problem = problemOptional.get();
        List<ProblemOption> optionForProblem = problemOptionService.getOptionsForDelete(problem);

        for(ProblemOption problemOption : optionForProblem){
            problemOptionRepo.delete(problemOption);
        }
        problemRepo.delete(problem);
    }
}

















