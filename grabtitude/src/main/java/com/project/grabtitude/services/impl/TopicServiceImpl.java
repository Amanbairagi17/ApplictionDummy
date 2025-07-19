package com.project.grabtitude.services.impl;

import com.project.grabtitude.entity.Topic;
import com.project.grabtitude.helper.ResourceNotFoundException;
import com.project.grabtitude.repository.TopicRepo;
import com.project.grabtitude.services.TopicService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TopicServiceImpl implements TopicService {
    private TopicRepo topicRepo;
    public TopicServiceImpl(TopicRepo topicRepo){
        this.topicRepo = topicRepo;
    }

    @Override
    public Topic getById(Long id) {
        Optional<Topic> topicOptional = topicRepo.findById(id);
        if(topicOptional.isEmpty()) throw new ResourceNotFoundException("Topic not found with given id");
        return topicOptional.get();
    }

    @Override
    public Page<Topic> getAll(int page, int size) {
        Sort sort = Sort.by("name").ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return topicRepo.findAll(pageable);
    }

    @Override
    public Topic updateTopic(Topic topic) {
        Optional<Topic> topicOptional = topicRepo.findById(topic.getId());
        if(topicOptional.isEmpty()) throw new ResourceNotFoundException("Topic id to update is incorrect");
        Topic savedTopic = topicOptional.get();
        savedTopic.setName(topic.getName());
        savedTopic.setDescription(topic.getDescription());
        topicRepo.save(savedTopic);
        return savedTopic;
    }

    @Override
    public void deleteTopicById(long id) {
        topicRepo.deleteById(id);
        return;
    }

    @Override
    public Topic createTopic(Topic topic) {
        return topicRepo.save(topic);
    }
}
