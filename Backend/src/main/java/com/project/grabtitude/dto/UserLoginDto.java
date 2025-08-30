package com.project.grabtitude.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Getter
@Setter
public class UserLoginDto {
    @NotNull(message = "Please enter your email")
    @Email(message = "Please enter a valid email address")
    private String email;

    @NotNull(message = "Please enter your password")
    private String password;
}
