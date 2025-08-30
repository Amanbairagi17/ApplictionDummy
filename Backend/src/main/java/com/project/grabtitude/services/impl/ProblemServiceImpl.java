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

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

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
        Page<Problem> problems = problemRepo.findAllWithTopic(pageable);

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

        boolean isFirstForToday = updateStreak(user);

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

    private boolean updateStreak(User user) {
        LocalDate today = LocalDate.now();
        LocalDate yesterday = today.minusDays(1);
        if(user.getLastSubmittedAt() != null && user.getLastSubmittedAt().isEqual(yesterday)){
            user.setStreak(user.getStreak()+1);
            user.setMaxStreak(Math.max(user.getStreak(), user.getMaxStreak()));
            user.setLastSubmittedAt(today);
            return true;
        }
        else {
            user.setLastSubmittedAt(today);
            user.setStreak(1);
            user.setMaxStreak(Math.max(user.getMaxStreak(), user.getStreak()));
        }
        userRepo.save(user);
        return false;
    }

    @Override
    public CustomPageResponse<ProblemResponseDto> search(String keyword, int page, int size) {
        int n = keyword.length();
        if(n > 100) throw new ResourceNotFoundException("Keyword size cannot be greater than 100");

        Pageable pageable = PageRequest.of(page, size);
        Page<Problem> problemPage = problemRepo.findByTitleContainingWithTopic(keyword, pageable);
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
        System.out.println("Updating problem with data: " + problemUpdateDto);
        
        Optional<Problem> problemOptional = problemRepo.findById(problemUpdateDto.getProblemId());
        if(problemOptional.isEmpty()) throw new ResourceNotFoundException("Problem with problem id " + problemUpdateDto.getProblemId() +
                " does not exist, please enter a valid problem id or create one");

        Optional<Topic> topicOptional = topicRepo.findById(problemUpdateDto.getTopicId());
        if(topicOptional.isEmpty()) throw new ResourceNotFoundException("Topic with topic id " + problemUpdateDto.getTopicId() +
                " does not exist, please enter a valid topic id or create one");

        Problem problem = problemOptional.get();
        Topic topic = topicOptional.get();

        System.out.println("Found problem: " + problem.getTitle() + ", topic: " + topic.getName());

        // Update basic problem fields
        problem.setTitle(problemUpdateDto.getTitle());
        problem.setDescription(problemUpdateDto.getDescription());
        problem.setCategory(problemUpdateDto.getCategory());
        problem.setTopic(topic);
        
        String difficulty = problemUpdateDto.getDifficulty();
        if(difficulty.equals("EASY")) problem.setDifficulty(Problem.Difficulty.EASY);
        else if(difficulty.equals("MEDIUM")) problem.setDifficulty(Problem.Difficulty.MEDIUM);
        else if(difficulty.equals("HARD")) problem.setDifficulty(Problem.Difficulty.HARD);
        else if(difficulty.equals("EXPERT")) problem.setDifficulty(Problem.Difficulty.EXPERT);
        else throw new ResourceNotFoundException("Please enter a valid difficulty");

        // Save the problem first to ensure topic relationship is persisted
        Problem savedProblem = problemRepo.save(problem);
        System.out.println("Saved problem with topic: " + savedProblem.getTopic().getName());

        System.out.println("Updated problem fields, options count: " + problemUpdateDto.getOptions().size());

        // Get existing options for this problem
        List<ProblemOption> existingOptions = problemOptionRepo.findAllByProblem(problem);
        System.out.println("Found " + existingOptions.size() + " existing options");

        // Update options in place instead of deleting them to preserve foreign key relationships
        List<ProblemOptionResponseDto> updatedOptions = new ArrayList<>();
        
        for(int i = 0; i < problemUpdateDto.getOptions().size(); i++) {
            ProblemOptionUpdateDto optionDto = problemUpdateDto.getOptions().get(i);
            
            if (i < existingOptions.size()) {
                // Update existing option
                ProblemOption existingOption = existingOptions.get(i);
                existingOption.setContent(optionDto.getContent());
                existingOption.setCorrect(optionDto.getCorrect());
                ProblemOption savedOption = problemOptionRepo.save(existingOption);
                updatedOptions.add(problemOptionResponseMapper.mapTo(savedOption));
                System.out.println("Updated existing option: " + savedOption.getId());
            } else {
                // Create new option if we need more
                ProblemOption newOption = new ProblemOption();
                newOption.setContent(optionDto.getContent());
                newOption.setCorrect(optionDto.getCorrect());
                newOption.setProblem(problem);
                ProblemOption savedOption = problemOptionRepo.save(newOption);
                updatedOptions.add(problemOptionResponseMapper.mapTo(savedOption));
                System.out.println("Created new option: " + savedOption.getId());
            }
        }

        // If we have fewer options now, handle extra ones safely
        if (existingOptions.size() > problemUpdateDto.getOptions().size()) {
            for (int i = problemUpdateDto.getOptions().size(); i < existingOptions.size(); i++) {
                ProblemOption optionToRemove = existingOptions.get(i);
                // For now, just mark extra options as inactive instead of deleting
                // This prevents foreign key constraint violations
                System.out.println("Marking extra option as inactive: " + optionToRemove.getId());
                // We could add an 'active' field to ProblemOption entity if needed
                // For now, we'll keep them but they won't be returned in the response
            }
        }

        System.out.println("Final options count: " + updatedOptions.size());

        // Save the updated problem
        Problem finalSavedProblem = problemRepo.save(problem);
        
        ProblemResponseDto problemResponseDto = problemResponseDtoMapper.mapTo(finalSavedProblem);
        problemResponseDto.setTopicName(topic.getName());
        problemResponseDto.setOptions(updatedOptions);
        
        System.out.println("Problem updated successfully");
        return problemResponseDto;
    }


    @Override
    public Map<String, Integer> getDifficultyStats(User user) {
        List<Submission> submissions = submissionRepo.findAllByUser(user);

        Map<String, Integer> difficultyMap = new HashMap<>();
        Set<Long> seenProblems = new HashSet<>();

        for (Submission submission : submissions) {
            if (submission.isCorrect()) {
                Long problemId = submission.getProblem().getProblemId();
                if (!seenProblems.contains(problemId)) {
                    seenProblems.add(problemId);
                    String difficulty = submission.getProblem().getDifficulty().toString();
                    difficultyMap.put(difficulty, difficultyMap.getOrDefault(difficulty, 0) + 1);
                }
            }
        }
        return difficultyMap;
    }

    @Override
    public Map<String, Integer> getTopicStats(User user) {
        List<Submission> submissions = submissionRepo.findAllByUser(user);

        Map<String, Integer> topicMap = new HashMap<>();
        Set<Long> seenProblems = new HashSet<>();

        for (Submission submission : submissions) {
            if (submission.isCorrect()) {
                Long problemId = submission.getProblem().getProblemId();
                if (!seenProblems.contains(problemId)) {
                    seenProblems.add(problemId);
                    String topic = submission.getProblem().getTopic().toString();
                    topicMap.put(topic, topicMap.getOrDefault(topic, 0) + 1);
                }
            }
        }

        return topicMap;
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

    // New method implementations for ProblemController
    @Override
    public List<ProblemResponseDto> getAllProblems() {
        List<Problem> problems = problemRepo.findAllWithTopic();
        return problems.stream().map(problem -> {
            ProblemResponseDto problemResponseDto = problemResponseDtoMapper.mapTo(problem);
            List<ProblemOptionResponseDto> problemOptionDtos = problemOptionService.getOptionForProblem(problem);
            problemResponseDto.setOptions(problemOptionDtos);
            problemResponseDto.setTopicName(problem.getTopic().getName());
            return problemResponseDto;
        }).collect(Collectors.toList());
    }

    @Override
    public ProblemResponseDto getProblemById(Long id) {
        return getById(id); // Reuse existing method
    }

    @Override
    public List<ProblemResponseDto> getProblemsByTopic(Long topicId) {
        List<Problem> problems = problemRepo.findByTopicIdWithTopic(topicId);
        return problems.stream().map(problem -> {
            ProblemResponseDto problemResponseDto = problemResponseDtoMapper.mapTo(problem);
            List<ProblemOptionResponseDto> problemOptionDtos = problemOptionService.getOptionForProblem(problem);
            problemResponseDto.setOptions(problemOptionDtos);
            // Since we're filtering by topic, we can get the topic name from the topicId
            problemResponseDto.setTopicName(problem.getTopic().getName());
            return problemResponseDto;
        }).collect(Collectors.toList());
    }

    @Override
    public List<ProblemResponseDto> getProblemsByDifficulty(String difficulty) {
        Problem.Difficulty diff;
        try {
            diff = Problem.Difficulty.valueOf(difficulty.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ResourceNotFoundException("Invalid difficulty level: " + difficulty);
        }
        
        List<Problem> problems = problemRepo.findByDifficultyWithTopic(diff);
        return problems.stream().map(problem -> {
            ProblemResponseDto problemResponseDto = problemResponseDtoMapper.mapTo(problem);
            List<ProblemOptionResponseDto> problemOptionDtos = problemOptionService.getOptionForProblem(problem);
            problemResponseDto.setOptions(problemOptionDtos);
            problemResponseDto.setTopicName(problem.getTopic().getName());
            return problemResponseDto;
        }).collect(Collectors.toList());
    }

    @Override
    public List<ProblemResponseDto> getAllProblemsForAdmin() {
        return getAllProblems(); // Same as getAllProblems for now
    }

    @Override
    public void deleteProblem(Long id) {
        deleteProblemById(id); // Reuse existing method
    }
}

















