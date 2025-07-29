package com.project.grabtitude.dto;

import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProblemOptionUpdateDto {
    private Long id;
    private String content;
    private boolean correct;
}
