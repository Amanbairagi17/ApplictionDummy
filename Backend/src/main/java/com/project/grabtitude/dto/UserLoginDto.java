package com.project.grabtitude.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserLoginDto {
    @Size(min = 2, max = 50, message = "Name length should be between 2 to 50 characters")
    private String name;

    @Size(min = 8, max = 12, message = "Password length should be between 8 to 12")
    private String password;
}
