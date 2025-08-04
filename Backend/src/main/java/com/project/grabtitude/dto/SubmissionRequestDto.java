package com.project.grabtitude.dto;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubmissionRequestDto {
    private Long problemId;
    private Long optionId;
}
