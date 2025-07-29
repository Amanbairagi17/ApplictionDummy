package com.project.grabtitude.controllers;

import com.project.grabtitude.dto.ProblemRequestDto;
import com.project.grabtitude.dto.ProblemResponseDto;
import com.project.grabtitude.dto.ProblemUpdateDto;
import com.project.grabtitude.entity.Topic;
import com.project.grabtitude.helper.AppConstants;
import com.project.grabtitude.helper.CustomPageResponse;
import com.project.grabtitude.services.ProblemService;
import com.project.grabtitude.services.TopicService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController()
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {
    private final ProblemService problemService;

    private final TopicService topicService;
    public AdminController(ProblemService problemService, TopicService topicService){
        this.problemService = problemService;
        this.topicService = topicService;
    }

    @PostMapping("/problem/create")
    public ResponseEntity<ProblemResponseDto> createProblem(@RequestBody ProblemRequestDto problemRequestDto){
        return ResponseEntity.status(HttpStatus.CREATED).body(problemService.createProblem(problemRequestDto));
    }

    @PutMapping("/problem/update")
    public ResponseEntity<ProblemResponseDto> updateProblem(@RequestBody ProblemUpdateDto problemUpdateDto){
        return new ResponseEntity<>(problemService.update(problemUpdateDto), HttpStatus.OK);
    }

    @PostMapping("topic/create")
    public ResponseEntity<Topic> createTopic(@RequestBody Topic topic){
        return new ResponseEntity<>(topicService.createTopic(topic), HttpStatus.CREATED);
    }

    @GetMapping("/topic/get/{id}")
    public ResponseEntity<Topic> getTopicById(@PathVariable Long id){
        return new ResponseEntity<>(topicService.getById(id), HttpStatus.OK);
    }

    @GetMapping("/topic/get-all")
    public ResponseEntity<CustomPageResponse<Topic>> getAllTopics(@RequestParam(value = "page", defaultValue = AppConstants.page) int page,
                                                                  @RequestParam(value = "size", defaultValue = AppConstants.size) int size) {
        if(page < 0) page = Integer.parseInt(AppConstants.page);
        if(size <= 0) size = Integer.parseInt(AppConstants.size);
        return new ResponseEntity<>(topicService.getAll(page, size), HttpStatus.OK);
    }

    @PutMapping("/topic/update")
    public ResponseEntity<Topic> updateTopic(@RequestBody Topic topic){
        return new ResponseEntity<>(topicService.updateTopic(topic), HttpStatus.CREATED);
    }

    @DeleteMapping("/topic/delete/{id}")
    public ResponseEntity<Topic> deleteTopic(@PathVariable Long id){
        topicService.deleteTopicById(id);
        return new ResponseEntity(null, HttpStatus.NO_CONTENT);
    }

    @DeleteMapping("/problem/delete/{id}")
    public ResponseEntity<ProblemResponseDto> deleteProblem(@PathVariable Long id){
        problemService.deleteProblemById(id);
        return new ResponseEntity(null, HttpStatus.NO_CONTENT);
    }
}
