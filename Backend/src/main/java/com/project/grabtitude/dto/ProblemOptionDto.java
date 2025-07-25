package com.project.grabtitude.dto;


import lombok.*;

@Getter
@Setter
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ProblemOptionDto {
    private boolean correct;
    private String content;
}