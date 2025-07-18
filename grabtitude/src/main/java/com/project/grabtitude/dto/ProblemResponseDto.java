package com.project.grabtitude.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProblemResponseDto {
    private Long problemId;

    private String title;

    private String description;

    private String difficulty;

    private long topicId;

    private List<ProblemOptionDto> options;

    private LocalDateTime createdAt;

}
