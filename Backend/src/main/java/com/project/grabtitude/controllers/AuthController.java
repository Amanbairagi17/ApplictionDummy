package com.project.grabtitude.controllers;

import com.project.grabtitude.dto.PendingVerificationUserRequestDto;
import com.project.grabtitude.dto.PendingVerificationUserResponseDto;
import com.project.grabtitude.dto.UserResponseDto;
import com.project.grabtitude.dto.AuthResponseDto;
import com.project.grabtitude.config.JwtUtil;
import com.project.grabtitude.dto.UserLoginDto;
import com.project.grabtitude.entity.User;
import com.project.grabtitude.helper.AppConstants;
import com.project.grabtitude.services.PendingVerificationUserService;
import com.project.grabtitude.services.UserService;
import com.project.grabtitude.mapper.impl.UserResponseMapper;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(originPatterns = "*", allowedHeaders = "*")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final PendingVerificationUserService pendingVerificationUserService;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserResponseMapper userResponseMapper;

    public AuthController(PendingVerificationUserService pendingVerificationUserService,
                          UserService userService,
                          PasswordEncoder passwordEncoder,
                          JwtUtil jwtUtil,
                          UserResponseMapper userResponseMapper) {
        this.pendingVerificationUserService = pendingVerificationUserService;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.userResponseMapper = userResponseMapper;
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Backend is working! CORS is configured.");
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK");
    }

    @PostMapping("/register-user")
    public ResponseEntity<PendingVerificationUserResponseDto> createUser(
            @Valid @RequestBody PendingVerificationUserRequestDto pendingVerificationUserRequestDto) {
        PendingVerificationUserResponseDto response = pendingVerificationUserService.saveUser(pendingVerificationUserRequestDto);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody UserLoginDto userLoginDto,
                                                 HttpServletResponse response) {
        UserResponseDto user = userService.authenticateUser(userLoginDto.getEmail(), userLoginDto.getPassword());

        // Access token
        String token = jwtUtil.generateToken(user.getEmail(), Map.of(
                "role", user.getRole() != null ? user.getRole() : "USER",
                "userId", user.getUserId()
        ));

        // Refresh token
        String refreshToken = jwtUtil.generateToken(user.getEmail(), Map.of("type", "refresh"));
        Cookie cookie = new Cookie("rt", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setSecure(true); // IMPORTANT for production
        cookie.setPath("/");
        cookie.setMaxAge(7 * 24 * 60 * 60);
        response.addCookie(cookie);

        return ResponseEntity.ok(new AuthResponseDto(token, user));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponseDto> refresh(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return ResponseEntity.status(401).build();

        String refreshToken = null;
        for (Cookie c : cookies) {
            if ("rt".equals(c.getName())) {
                refreshToken = c.getValue();
                break;
            }
        }
        if (refreshToken == null) return ResponseEntity.status(401).build();

        try {
            var claims = jwtUtil.parseClaims(refreshToken);
            if (!"refresh".equals(claims.get("type", String.class))) {
                return ResponseEntity.status(401).build();
            }

            String email = claims.getSubject();
            User user = userService.findByEmail(email); // fetch role + id

            String newAccess = jwtUtil.generateToken(email, Map.of(
                    "role", user.getRole() != null ? user.getRole().toString() : "USER",
                    "userId", String.valueOf(user.getUserId())
            ));

            UserResponseDto userDto = userResponseMapper.mapTo(user);
            return ResponseEntity.ok(new AuthResponseDto(newAccess, userDto));
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    @PostMapping("/register-admin")
    public ResponseEntity<PendingVerificationUserResponseDto> createAdmin(
            @Valid @RequestBody PendingVerificationUserRequestDto pendingVerificationUserRequestDto) {
        pendingVerificationUserRequestDto.setRole("ADMIN");
        PendingVerificationUserResponseDto response = pendingVerificationUserService.saveUser(pendingVerificationUserRequestDto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/verify-email")
    public ResponseEntity<Boolean> verifyUser(@RequestParam(value = "token", defaultValue = AppConstants.token) String token,
                                              @RequestParam(value = "email", defaultValue = "") String email) {
        return ResponseEntity.ok(pendingVerificationUserService.verifyUser(token, email));
    }
}







