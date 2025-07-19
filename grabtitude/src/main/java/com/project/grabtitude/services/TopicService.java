package com.project.grabtitude.services;


import com.project.grabtitude.entity.Topic;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface TopicService {
    Topic createTopic(Topic topic);

    Topic getById(Long id);

    Page<Topic> getAll(int page, int size);

    Topic updateTopic(Topic topic);

    void deleteTopicById(long id);
}
