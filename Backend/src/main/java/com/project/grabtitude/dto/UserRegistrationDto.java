package com.project.grabtitude.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Getter
@Setter
public class UserRegistrationDto {
    @NotNull(message = "Please enter your name")
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
    private String name;

    @NotNull(message = "Please enter your email")
    @Email(message = "Please enter a valid email address")
    private String email;

    @NotNull(message = "Please enter your password")
    @Size(min = 8, max = 12, message = "Password must be between 8 and 12 characters")
    private String password;

    @NotNull(message = "Please select a role")
    private String role; // "USER" or "ADMIN"

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getRole() {
        return role;
    }
}
