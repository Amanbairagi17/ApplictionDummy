package com.project.grabtitude.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ProblemRequestDto {
    private String title;

    private String description;

    private String difficulty;

    private long topicId;

    private List<ProblemOptionDto> options;
}
