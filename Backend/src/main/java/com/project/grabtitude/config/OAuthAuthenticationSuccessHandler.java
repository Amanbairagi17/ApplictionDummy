package com.project.grabtitude.config;

import com.project.grabtitude.entity.User;
import com.project.grabtitude.services.UserService;
import com.project.grabtitude.config.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Component
public class OAuthAuthenticationSuccessHandler implements AuthenticationSuccessHandler, ApplicationContextAware {
    private static final Logger logger = LoggerFactory.getLogger(OAuthAuthenticationSuccessHandler.class);
    
    private UserService userService;
    private final JwtUtil jwtUtil;
    private ApplicationContext applicationContext;

    public OAuthAuthenticationSuccessHandler(UserService userService, JwtUtil jwtUtil){
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication
                                        ) throws IOException, ServletException {

        try {
            logger.info("=== OAUTH SUCCESS HANDLER START ===");
            
            // Check authentication object
            if (authentication == null) {
                logger.error("Authentication object is NULL");
                throw new RuntimeException("Authentication object is null");
            }
            logger.info("Authentication type: {}", authentication.getClass().getSimpleName());
            
            OAuth2AuthenticationToken oAuth2AuthenticationToken = (OAuth2AuthenticationToken) authentication;
            OAuth2User oAuth2User = oAuth2AuthenticationToken.getPrincipal();

            logger.info("Processing OAuth2 authentication for user");
            logger.info("OAuth2User principal: {}", oAuth2User != null ? "Found" : "NULL");
            
            if (oAuth2User == null) {
                logger.error("OAuth2User principal is NULL");
                throw new RuntimeException("OAuth2User principal is null");
            }
            
            // Get UserService from ApplicationContext if not injected
            if (userService == null && applicationContext != null) {
                userService = applicationContext.getBean(UserService.class);
                logger.info("UserService injected from ApplicationContext");
            }
            logger.info("UserService available: {}", userService != null ? "Yes" : "No");

            String email = oAuth2User.getAttribute("email");
            String name = oAuth2User.getAttribute("name");
            String picture = oAuth2User.getAttribute("picture");
            if (name == null) name = oAuth2User.getName();

            logger.info("OAuth2 user data - Email: {}, Name: {}, Picture: {}", email, name, picture != null ? "Present" : "None");

            // Validate required fields
            if (email == null || email.trim().isEmpty()) {
                logger.error("Email is null or empty in OAuth2 authentication");
                throw new RuntimeException("Email is required for OAuth2 authentication");
            }

            // Find or create OAuth2 user
            logger.info("Creating or finding user with email: {}", email);
            User user = userService.findOrCreateOAuth2User(email, name, picture);
            logger.info("User found/created with ID: {}, Role: {}", user.getUserId(), user.getRole());

            // Generate JWT token
            logger.info("Generating JWT token for user ID: {}", user.getUserId());
            Map<String, Object> claims = new HashMap<>();
            claims.put("userId", user.getUserId());
            claims.put("role", user.getRole().toString());
            String token = jwtUtil.generateToken(user.getEmail(), claims);
            logger.info("JWT token generated successfully, length: {}", token.length());

            // Redirect to frontend with token
            String redirectUrl = "http://localhost:5173/auth/callback?token=" + token;
            logger.info("=== REDIRECTING TO FRONTEND ===");
            logger.info("Redirect URL: {}", redirectUrl);
            logger.info("Token preview: {}...", token.substring(0, Math.min(20, token.length())));
            response.sendRedirect(redirectUrl);
            logger.info("=== OAUTH SUCCESS HANDLER END ===");
            
        } catch (Exception e) {
            // Log error with proper logging framework
            logger.error("=== OAUTH SUCCESS HANDLER EXCEPTION ===");
            logger.error("Exception type: {}", e.getClass().getSimpleName());
            logger.error("Exception message: {}", e.getMessage());
            logger.error("Full stack trace:", e);
            
            // Log the specific point of failure
            if (e.getMessage() != null) {
                if (e.getMessage().contains("UserService")) {
                    logger.error("FAILURE POINT: UserService injection or user creation");
                } else if (e.getMessage().contains("JWT") || e.getMessage().contains("token")) {
                    logger.error("FAILURE POINT: JWT token generation");
                } else if (e.getMessage().contains("email")) {
                    logger.error("FAILURE POINT: Email validation or extraction");
                } else {
                    logger.error("FAILURE POINT: Unknown - check full stack trace above");
                }
            }
            
            try {
                response.sendRedirect("http://localhost:5173/signin?error=oauth_failed");
            } catch (IOException ioException) {
                logger.error("Failed to redirect after OAuth error: {}", ioException.getMessage());
            }
        }
    }
}
