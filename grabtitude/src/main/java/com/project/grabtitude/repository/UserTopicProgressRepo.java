package com.project.grabtitude.repository;

import com.project.grabtitude.entity.UserTopicProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserTopicProgressRepo extends JpaRepository<UserTopicProgress, Long> {
}
