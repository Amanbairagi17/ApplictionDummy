package com.project.grabtitude.services;


import com.project.grabtitude.entity.Topic;
import com.project.grabtitude.helper.CustomPageResponse;

public interface TopicService {
    Topic createTopic(Topic topic);

    Topic getById(Long id);

    CustomPageResponse<Topic> getAll(int page, int size);

    Topic updateTopic(Topic topic);

    void deleteTopicById(long id);
}
