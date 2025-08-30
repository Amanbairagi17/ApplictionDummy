package com.project.grabtitude.controllers;

import com.project.grabtitude.dto.TopicRequestDto;
import com.project.grabtitude.dto.TopicResponseDto;
import com.project.grabtitude.dto.TopicUpdateDto;
import com.project.grabtitude.helper.CustomPageResponse;
import com.project.grabtitude.services.TopicService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/topics/")
@CrossOrigin(originPatterns = "*", allowedHeaders = "*")
public class TopicController {
    
    private static final Logger logger = LoggerFactory.getLogger(TopicController.class);
    
    private final TopicService topicService;
    
    public TopicController(TopicService topicService) {
        this.topicService = topicService;
    }
    
    // Public endpoints - accessible to all users
    @GetMapping("/get-all")
    public ResponseEntity<CustomPageResponse<TopicResponseDto>> getAllTopics(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        logger.info("Fetching all topics");
        CustomPageResponse<TopicResponseDto> topics = topicService.getAll(page, size);
        return ResponseEntity.ok(topics);
    }

    @GetMapping("/all")
    public ResponseEntity<List<TopicResponseDto>> getAllTopicsNoPagination() {
        logger.info("Fetching all topics (no pagination)");
        return ResponseEntity.ok(topicService.getAll());
    }
    
    @GetMapping("/get/{id}")
    public ResponseEntity<TopicResponseDto> getTopicById(@PathVariable Long id) {
        logger.info("Fetching topic with id: {}", id);
        TopicResponseDto topic = topicService.getById(id);
        return ResponseEntity.ok(topic);
    }
    
    // Admin endpoints - require admin authentication
    @PostMapping("/admin/create")
    public ResponseEntity<TopicResponseDto> createTopic(@Valid @RequestBody TopicRequestDto topicRequestDto) {
        logger.info("Creating new topic: {}", topicRequestDto.getName());
        TopicResponseDto createdTopic = topicService.createTopic(topicRequestDto);
        return ResponseEntity.ok(createdTopic);
    }
    
    @PutMapping("/admin/update")
    public ResponseEntity<TopicResponseDto> updateTopic(@Valid @RequestBody TopicUpdateDto topicUpdateDto) {
        logger.info("Updating topic with id: {}", topicUpdateDto.getId());
        TopicResponseDto updatedTopic = topicService.updateTopic(topicUpdateDto);
        return ResponseEntity.ok(updatedTopic);
    }
    
    @DeleteMapping("/admin/delete/{id}")
    public ResponseEntity<String> deleteTopic(@PathVariable Long id) {
        logger.info("Deleting topic with id: {}", id);
        topicService.deleteTopicById(id);
        return ResponseEntity.ok("Topic deleted successfully");
    }
}
