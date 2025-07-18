package com.project.grabtitude.services;


import com.project.grabtitude.entity.Topic;

import java.util.List;
import java.util.Optional;

public interface TopicService {
    Topic createTopic(Topic topic);

    Topic getById(Long id);

    List<Topic> getAll();

    Topic updateTopic(Topic topic);

    void deleteTopicById(long id);
}
