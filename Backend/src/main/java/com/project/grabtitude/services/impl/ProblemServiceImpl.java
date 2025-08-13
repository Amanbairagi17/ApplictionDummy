package com.project.grabtitude.services.impl;

import com.project.grabtitude.dto.*;
import com.project.grabtitude.entity.*;
import com.project.grabtitude.helper.AuthUtil;
import com.project.grabtitude.helper.CustomPageResponse;
import com.project.grabtitude.helper.ResourceNotFoundException;
import com.project.grabtitude.mapper.Mapper;
import com.project.grabtitude.mapper.impl.SubmissionResponseMapper;
import com.project.grabtitude.repository.*;
import com.project.grabtitude.services.ProblemOptionService;
import com.project.grabtitude.services.ProblemService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProblemServiceImpl implements ProblemService {
    private final ProblemRepo problemRepo;
    private final Mapper<ProblemOption, ProblemOptionRequestDto> problemOptionRequestMapper;
    private final Mapper<ProblemOption, ProblemOptionResponseDto> problemOptionResponseMapper;
    private final Mapper<Problem, ProblemResponseDto> problemResponseDtoMapper;
    private final Mapper<Problem, ProblemRequestDto> problemRequestDtoMapper;
    private final ProblemOptionRepo problemOptionRepo;
    private final TopicRepo topicRepo;
    private final ProblemOptionService problemOptionService;
    private final AuthUtil authUtil;
    private final UserRepo userRepo;
    private final SubmissionRepo submissionRepo;
    private final SubmissionResponseMapper submissionResponseMapper;
    public ProblemServiceImpl(ProblemRepo problemRepo, ProblemOptionRepo problemOptionRepo,
                              Mapper<ProblemOption, ProblemOptionRequestDto> problemOptionRequestMapper,
                              Mapper<ProblemOption, ProblemOptionResponseDto> problemOptionResponseMapper,
                              Mapper<Problem, ProblemResponseDto> problemResponseDtoMapper,
                              Mapper<Problem, ProblemRequestDto> problemRequestDtoMapper,
                              TopicRepo topicRepo, ProblemOptionService problemOptionService,
                              AuthUtil authUtil, UserRepo userRepo, SubmissionRepo submissionRepo,
                              SubmissionResponseMapper submissionResponseMapper
    ){
        this.problemRepo = problemRepo;
        this.problemOptionRepo = problemOptionRepo;
        this.problemOptionRequestMapper = problemOptionRequestMapper;
        this.problemOptionResponseMapper = problemOptionResponseMapper;
        this.problemRequestDtoMapper = problemRequestDtoMapper;
        this.problemResponseDtoMapper = problemResponseDtoMapper;
        this.topicRepo = topicRepo;
        this.problemOptionService = problemOptionService;
        this.authUtil = authUtil;
        this.userRepo = userRepo;
        this.submissionRepo = submissionRepo;
        this.submissionResponseMapper = submissionResponseMapper;
    }

    @Override
    public ProblemResponseDto createProblem(ProblemRequestDto problemRequestDto) {
        System.out.println(problemRequestDto);
        List<ProblemOptionRequestDto> problemOptionDtos = problemRequestDto.getOptions();
        long topicId = problemRequestDto.getTopicId();

        Optional<Topic> topicOptional = topicRepo.findById(topicId);
        if(topicOptional.isEmpty()) throw new ResourceNotFoundException("Topic not found with id : " + topicId);
        Topic topic = topicOptional.get();

        Problem problem = problemRequestDtoMapper.mapFrom(problemRequestDto);
        problem.setTopic(topic);
        Problem savedProblem = problemRepo.save(problem);
        ProblemResponseDto problemResponseDto = problemResponseDtoMapper.mapTo(savedProblem);

        List<ProblemOptionResponseDto> savedProblemOptionDtos = new ArrayList<>();
        for(ProblemOptionRequestDto optionDto : problemOptionDtos){
            ProblemOption option = problemOptionRequestMapper.mapFrom(optionDto);
            option.setProblem(savedProblem);
            ProblemOption savedOption = problemOptionRepo.save(option);
            savedProblemOptionDtos.add(problemOptionResponseMapper.mapTo(savedOption));
        }

        problemResponseDto.setOptions(savedProblemOptionDtos);
        problemResponseDto.setTopicName(topic.getName());
        return problemResponseDto;
    }

    @Override
    public ProblemResponseDto getById(Long id) {
        Optional<Problem> problemOptional = problemRepo.findById(id);
        if(problemOptional.isEmpty()) throw new ResourceNotFoundException("Problem not found with problem id : " + id);
        Problem problem = problemOptional.get();
        List<ProblemOptionResponseDto> problemOptionDtos = problemOptionService.getOptionForProblem(problem);

        ProblemResponseDto problemResponseDto = problemResponseDtoMapper.mapTo(problem);
        problemResponseDto.setOptions(problemOptionDtos);
        problemResponseDto.setTopicName(problem.getTopic().getName());
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
            List<ProblemOptionResponseDto> problemOptionDtos = problemOptionService.getOptionForProblem(problem);
            problemResponseDto.setOptions(problemOptionDtos);
            problemResponseDto.setTopicName(problem.getTopic().getName());
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
    public SubmissionResponseDto submit(SubmissionRequestDto submissionRequestDto) {
        String email = authUtil.getEmailOfLoggedUser();

//      Optional<User> userOptional = userRepo.findByEmail(email);
//      if(userOptional.isEmpty()) throw new ResourceNotFoundException("Please login and logout again");
//      to reduce this, the above one i.e. first getting optional then if it is empty throw error we can do it
//      in one line using this, here if we get null we throw or if we get something we directly extract it

        User user = userRepo.findByEmail(email)
               .orElseThrow(() -> new ResourceNotFoundException("Please login and logout again"));

        ProblemOption problemOption = problemOptionRepo.findById(submissionRequestDto.getOptionId())
                .orElseThrow(() -> new ResourceNotFoundException("Please enter or select a valid option id"));

        Problem problem = problemRepo.findById(submissionRequestDto.getProblemId())
                .orElseThrow(() -> new ResourceNotFoundException("No such problem exist which you are trying to submit"));

        if(!problemOption.getProblem().getProblemId().equals(submissionRequestDto.getProblemId())){
            throw new ResourceNotFoundException("Please enter correct problemId and optionId");
        }

        Submission submission = new Submission();
        submission.setProblem(problem);
        submission.setUser(user);
        submission.setSelectedOption(problemOption);
        submission.setCorrect(problemOption.getCorrect());

        submissionRepo.save(submission);

        SubmissionResponseDto submissionResponseDto = submissionResponseMapper.mapTo(submission);
        submissionResponseDto.setSubmissionId(submission.getId());
        submissionResponseDto.setProblemId(submission.getProblem().getProblemId());
        return submissionResponseDto;
    }

    @Override
    public CustomPageResponse<ProblemResponseDto> search(String keyword, int page, int size) {
        int n = keyword.length();
        if(n > 100) throw new ResourceNotFoundException("Keyword size cannot be greater than 100");

        Pageable pageable = PageRequest.of(page, size);
        Page<Problem> problemPage = problemRepo.findByTitleContaining(keyword, pageable);
        Page<ProblemResponseDto> problemResponseDtoPage = problemPage.map(problem -> {
            ProblemResponseDto problemResponseDto = problemResponseDtoMapper.mapTo(problem);
            List<ProblemOptionResponseDto> optionForProblem = problemOptionService.getOptionForProblem(problem);
            problemResponseDto.setOptions(optionForProblem);
            problemResponseDto.setTopicName(problem.getTopic().getName());
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

        //if keyword is empty so it will get all so we not return at top and return here as we access 0th index
        if(keyword.isEmpty()) return responsePage;

        int ascii = (int)(keyword.charAt(0)-'0');
        if(ascii >= 0 && ascii <= 9){
            long searchId = 0L;
            int digits = 5;
            for(char ch : keyword.toCharArray()){
                int curr = (int)(ch-'0');
                if(curr >= 0 && curr <= 9) {
                    searchId = searchId * 10L + curr;
                    digits--;
                }
                if(digits == 0)break;
            }
            List<ProblemResponseDto> content = new ArrayList<>(problemResponseDtoPage.getContent());

            Optional<Problem> problemOptional = problemRepo.findById(searchId);
            if(problemOptional.isPresent()) {
                Problem problem = problemOptional.get();
                ProblemResponseDto problemResponseDto = problemResponseDtoMapper.mapTo(problem);
                List<ProblemOptionResponseDto> problemOptionDtos = problemOptionService.getOptionForProblem(problem);

                problemResponseDto.setOptions(problemOptionDtos);
                problemResponseDto.setTopicName(problem.getTopic().getName());

                content.add(0, problemResponseDto);
                responsePage.setNumberOfElements(responsePage.getNumberOfElements()+1);
                responsePage.setTotalNumberOfElements(responsePage.getTotalNumberOfElements()+1);
                responsePage.setContent(content);
            }
        }
        return responsePage;
    }

    @Override
    @Transactional
    public ProblemResponseDto update(ProblemUpdateDto problemUpdateDto) {
        Optional<Problem> problemOptional = problemRepo.findById(problemUpdateDto.getProblemId());
        if(problemOptional.isEmpty()) throw new ResourceNotFoundException("Problem with problem id " + problemUpdateDto.getProblemId() +
                " does not exist, please enter a valid problem id or create one");

        Optional<Topic> topicOptional = topicRepo.findById(problemUpdateDto.getTopicId());
        if(topicOptional.isEmpty()) throw new ResourceNotFoundException("Topic with topic id " + problemUpdateDto.getTopicId() +
                " does not exist, please enter a valid topic id or create one");

        Problem problem = problemOptional.get();
        Topic topic = topicOptional.get();

        problem.setTitle(problemUpdateDto.getTitle());
        String difficulty = problemUpdateDto.getDifficulty();
        problem.setDescription(problemUpdateDto.getDescription());
        problem.setTopic(topic);
        List<ProblemOptionResponseDto> updatedOptions = new ArrayList<>();

        if(difficulty.equals("EASY")) problem.setDifficulty(Problem.Difficulty.EASY);
        else if(difficulty.equals("MEDIUM")) problem.setDifficulty(Problem.Difficulty.MEDIUM);
        else if(difficulty.equals("HARD")) problem.setDifficulty(Problem.Difficulty.HARD);
        else if(difficulty.equals("EXPERT")) problem.setDifficulty(Problem.Difficulty.EXPERT);
        else throw new ResourceNotFoundException("Please enter a valid difficulty");

        ProblemResponseDto problemResponseDto = problemResponseDtoMapper.mapTo(problem);

        //update options
        for(ProblemOptionUpdateDto problemOptionUpdateDto : problemUpdateDto.getOptions()){
            Optional<ProblemOption> optionOptional = problemOptionRepo.findById(problemOptionUpdateDto.getId());
            if(optionOptional.isEmpty()) throw new ResourceNotFoundException("Problem option with id : " + problemOptionUpdateDto.getId() + " not found");
            ProblemOption problemOption = optionOptional.get();

            if(problemOption.getProblem().getProblemId() != problem.getProblemId()){
                throw new RuntimeException("The option id entered to update is not the option for given problem with problem id : " + problem.getProblemId());
            }
            problemOption.setContent(problemOptionUpdateDto.getContent());
            problemOption.setCorrect(problemOptionUpdateDto.getCorrect());
            ProblemOption savedOption = problemOptionRepo.save(problemOption);

            updatedOptions.add(problemOptionResponseMapper.mapTo(savedOption));
        }
        problemResponseDto.setTopicName(topic.getName());
        problemResponseDto.setOptions(updatedOptions);
        problemRepo.save(problem);
        return problemResponseDto;
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

















