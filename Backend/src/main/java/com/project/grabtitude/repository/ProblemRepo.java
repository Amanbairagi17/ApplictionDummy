package com.project.grabtitude.repository;

import com.project.grabtitude.entity.Problem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProblemRepo extends JpaRepository<Problem, Long> {
    @Query("SELECT p FROM Problem p JOIN FETCH p.topic")
    Page<Problem> findAllWithTopic(Pageable pageable);
    
    @Query("SELECT p FROM Problem p JOIN FETCH p.topic WHERE p.title LIKE %:title%")
    Page<Problem> findByTitleContainingWithTopic(@Param("title") String title, Pageable pageable);
    
    @Query("SELECT p FROM Problem p JOIN FETCH p.topic")
    List<Problem> findAllWithTopic();
    
    @Query("SELECT p FROM Problem p JOIN FETCH p.topic WHERE p.topic.id = :topicId")
    List<Problem> findByTopicIdWithTopic(@Param("topicId") Long topicId);
    
    @Query("SELECT p FROM Problem p JOIN FETCH p.topic WHERE p.difficulty = :difficulty")
    List<Problem> findByDifficultyWithTopic(@Param("difficulty") Problem.Difficulty difficulty);
    
    Page<Problem> findAll(Pageable pageable);
    Page<Problem> findByTitleContaining(String title, Pageable pageable);
    
    // New methods for ProblemController
    List<Problem> findByTopicId(Long topicId);
    List<Problem> findByDifficulty(Problem.Difficulty difficulty);
}
