package com.project.grabtitude.controllers;

import com.project.grabtitude.entity.User;
import com.project.grabtitude.services.UserService;
import com.project.grabtitude.config.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/auth/oauth2")
@CrossOrigin(origins = "*") // TODO: change to frontend URL in prod
public class OAuth2Controller {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/success")
    public ResponseEntity<?> oauth2Success(@AuthenticationPrincipal OAuth2User oauth2User) {
        if (oauth2User == null) {
            return ResponseEntity.status(400)
                    .body(Map.of("error", "OAuth2 authentication failed", "message", "No OAuth2User found"));
        }

        // Extract user info from Google profile
        String email = oauth2User.getAttribute("email");
        String name = oauth2User.getAttribute("name");
        String picture = oauth2User.getAttribute("picture");

        // Save or fetch existing user
        User user = userService.findOrCreateOAuth2User(email, name, picture);

        // Generate JWT
        Map<String, Object> claims = Map.of(
                "userId", user.getUserId(),
                "role", user.getRole().toString()
        );
        String token = jwtUtil.generateToken(user.getEmail(), claims);

        // Redirect user to frontend with token
        String redirectUrl = "http://localhost:5173/auth/callback?token=" + token;
        return ResponseEntity.status(302)
                .header("Location", redirectUrl)
                .build();
    }

    @GetMapping("/failure")
    public ResponseEntity<?> oauth2Failure() {
        return ResponseEntity.badRequest()
                .body(Map.of("error", "OAuth2 authentication failed"));
    }

    @GetMapping("/user")
    public ResponseEntity<?> getCurrentUser(HttpServletRequest request) {
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401)
                        .body(Map.of("error", "No valid token provided"));
            }

            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(401)
                        .body(Map.of("error", "Invalid token"));
            }

            String email = jwtUtil.getEmailFromToken(token);
            User user = userService.findByEmail(email);

            if (user == null) {
                return ResponseEntity.status(404)
                        .body(Map.of("error", "User not found"));
            }

            Map<String, Object> userInfo = Map.of(
                    "id", user.getUserId(),
                    "name", user.getName(),
                    "email", user.getEmail(),
                    "role", user.getRole().toString(),
                    "picture", user.getPicture() != null ? user.getPicture() : ""
            );

            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "Failed to get user data", "message", e.getMessage()));
        }
    }
}
