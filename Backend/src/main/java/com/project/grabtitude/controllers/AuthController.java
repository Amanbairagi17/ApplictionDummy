package com.project.grabtitude.controllers;

import com.project.grabtitude.dto.PendingVerificationUserRequestDto;
import com.project.grabtitude.dto.PendingVerificationUserResponseDto;
import com.project.grabtitude.dto.UserResponseDto;
import com.project.grabtitude.dto.AuthResponseDto;
import com.project.grabtitude.config.JwtUtil;
import com.project.grabtitude.dto.UserLoginDto;
import com.project.grabtitude.helper.AppConstants;
import com.project.grabtitude.services.PendingVerificationUserService;
import com.project.grabtitude.services.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth/")
@CrossOrigin(originPatterns = "*", allowedHeaders = "*")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    private final PendingVerificationUserService pendingVerificationUserService;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(PendingVerificationUserService pendingVerificationUserService,
                         UserService userService,
                         PasswordEncoder passwordEncoder,
                         JwtUtil jwtUtil){
        this.pendingVerificationUserService = pendingVerificationUserService;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        logger.info("Test endpoint called");
        return ResponseEntity.ok("Backend is working! CORS is configured.");
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        logger.info("Health check endpoint called");
        return ResponseEntity.ok("OK");
    }

    @PostMapping("/register-user")
    public ResponseEntity<PendingVerificationUserResponseDto> createUser(@Valid @RequestBody PendingVerificationUserRequestDto pendingVerificationUserRequestDto){
        logger.info("Registration request received for user: {}", pendingVerificationUserRequestDto.getEmail());
        try {
            PendingVerificationUserResponseDto response = pendingVerificationUserService.saveUser(pendingVerificationUserRequestDto);
            logger.info("User registered successfully: {}", pendingVerificationUserRequestDto.getEmail());
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            logger.error("Error registering user: {}", pendingVerificationUserRequestDto.getEmail(), e);
            throw e;
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody UserLoginDto userLoginDto, HttpServletResponse response) {
        logger.info("Login attempt for user: {}", userLoginDto.getEmail());
        try {
            UserResponseDto user = userService.authenticateUser(userLoginDto.getEmail(), userLoginDto.getPassword());
            logger.info("User logged in successfully: {}", userLoginDto.getEmail());
            String token = jwtUtil.generateToken(user.getEmail(), java.util.Map.of(
                    "role", user.getRole() != null ? user.getRole().toString() : "USER",
                    "userId", String.valueOf(user.getUserId())
            ));
            // issue refresh token cookie
            String refreshToken = jwtUtil.generateToken(user.getEmail(), java.util.Map.of(
                    "type", "refresh"
            ));
            Cookie cookie = new Cookie("rt", refreshToken);
            cookie.setHttpOnly(true);
            cookie.setSecure(false); // set true in HTTPS
            cookie.setPath("/");
            cookie.setMaxAge(7 * 24 * 60 * 60);
            response.addCookie(cookie);

            return ResponseEntity.ok().body(new AuthResponseDto(token, user));
        } catch (Exception e) {
            logger.error("Login failed for user: {}", userLoginDto.getEmail(), e);
            throw e;
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponseDto> refresh(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            return ResponseEntity.status(401).build();
        }
        String refreshToken = null;
        for (Cookie c : cookies) {
            if ("rt".equals(c.getName())) {
                refreshToken = c.getValue();
                break;
            }
        }
        if (refreshToken == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            var claims = jwtUtil.parseClaims(refreshToken);
            if (!"refresh".equals(claims.get("type", String.class))) {
                return ResponseEntity.status(401).build();
            }
            String email = claims.getSubject();
            // minimal user payload for access token; role fallback USER
            String newAccess = jwtUtil.generateToken(email, java.util.Map.of("role", "USER"));
            return ResponseEntity.ok(new AuthResponseDto(newAccess, null));
        } catch (Exception e) {
            return ResponseEntity.status(401).build();
        }
    }

    //The verification link will be sent to tarun's email and admin will be verified by tarun
    @PostMapping("/register-admin")
    public ResponseEntity<PendingVerificationUserResponseDto> createAdmin(@Valid @RequestBody PendingVerificationUserRequestDto pendingVerificationUserRequestDto){
        logger.info("Admin registration request received for user: {}", pendingVerificationUserRequestDto.getEmail());
        try {
            // Set role as ADMIN for admin registration
            pendingVerificationUserRequestDto.setRole("ADMIN");
            PendingVerificationUserResponseDto response = pendingVerificationUserService.saveUser(pendingVerificationUserRequestDto);
            logger.info("Admin registered successfully: {}", pendingVerificationUserRequestDto.getEmail());
            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            logger.error("Error registering admin: {}", pendingVerificationUserRequestDto.getEmail(), e);
            throw e;
        }
    }

    @GetMapping("/verify-email")
    public ResponseEntity<Boolean> verifyUser(@RequestParam(value = "token", defaultValue = AppConstants.token) String token,
                                              @RequestParam(value = "email", defaultValue = "") String email){
        return ResponseEntity.ok().body(pendingVerificationUserService.verifyUser(token, email));
    }
}















