package com.project.grabtitude.repository;

import com.project.grabtitude.entity.Submission;
import com.project.grabtitude.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SubmissionRepo extends JpaRepository<Submission, Long> {
    List<Submission> findAllByUser(User user);
    
    // Get submissions count by date for a specific user
    @Query("SELECT DATE(s.submittedAt) as date, COUNT(s) as count " +
           "FROM Submission s " +
           "WHERE s.user = :user " +
           "AND s.submittedAt >= :startDate " +
           "GROUP BY DATE(s.submittedAt) " +
           "ORDER BY date")
    List<Object[]> getSubmissionCountByDate(@Param("user") User user, @Param("startDate") LocalDateTime startDate);
    
    // Get submissions for a user within a date range
    List<Submission> findByUserAndSubmittedAtBetweenOrderBySubmittedAtDesc(
        User user, LocalDateTime startDate, LocalDateTime endDate);
}
