package com.project.grabtitude.config;

import com.project.grabtitude.entity.User;
import com.project.grabtitude.repository.UserRepo;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.DefaultRedirectStrategy;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

//Temporary code needs to be written again
@Component
public class OAuthAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    private final UserRepo userRepo;

    public OAuthAuthenticationSuccessHandler(UserRepo userRepo){
        this.userRepo = userRepo;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication
                                        ) throws IOException, ServletException {

        OAuth2AuthenticationToken oAuth2AuthenticationToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oAuth2User = oAuth2AuthenticationToken.getPrincipal();


        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        if (name == null) name = oAuth2User.getName();

        System.out.println("------------------------------------------------------------------------------------------------------");

        if(userRepo.findByEmail(email).isEmpty()){
            String id = UUID.randomUUID().toString();
            String password = UUID.randomUUID().toString();
            User user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(password);
            user.setUserId(id);
            userRepo.save(user);
            Authentication newAuth = new UsernamePasswordAuthenticationToken(
                    user, null, user.getAuthorities()
            );
            SecurityContextHolder.getContext().setAuthentication(newAuth);
        }
        new DefaultRedirectStrategy().sendRedirect(request, response, "/home");
    }
}
