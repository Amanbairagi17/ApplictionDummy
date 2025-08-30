package com.project.grabtitude.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class HeatmapDataDto {
    private String date;      // Format: "YYYY-MM-DD"
    private Integer count;    // Number of submissions on that date
}
