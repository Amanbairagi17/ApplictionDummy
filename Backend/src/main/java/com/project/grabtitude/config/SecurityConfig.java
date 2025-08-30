package com.project.grabtitude.config;


import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableMethodSecurity
@EnableWebSecurity
public class SecurityConfig implements WebMvcConfigurer {

    private final UserDetailsService userDetailsService;
    // OAuth handlers available if OAuth is enabled in future
    private final OAuthAuthenticationSuccessHandler oAuthAuthenticationSuccessHandler;
    private final OAuthAuthenticationFailureHandler oAuthAuthenticationFailureHandler;

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration-ms}")
    private long jwtExpirationMs;

    @Value("${app.cors.allowed-origins:http://localhost:5173}")
    private String corsAllowedOrigins;

    public SecurityConfig(UserDetailsService userDetailsService,
                          OAuthAuthenticationSuccessHandler oAuthAuthenticationSuccessHandler,
                        OAuthAuthenticationFailureHandler oAuthAuthenticationFailureHandler){
        this.userDetailsService = userDetailsService;
        this.oAuthAuthenticationSuccessHandler = oAuthAuthenticationSuccessHandler;
        this.oAuthAuthenticationFailureHandler = oAuthAuthenticationFailureHandler;
    }
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {

        httpSecurity.csrf(customizer -> customizer.disable());
        httpSecurity.cors(customizer -> customizer.configurationSource(corsConfigurationSource()));

        httpSecurity.authorizeHttpRequests(request -> {
            request.requestMatchers("/auth/**", "/home", "/", "/profile/**", "/get-user/**", "/get-user-id/**", "/problems/**", "/topics/**").permitAll();
            request.requestMatchers("/admin/**", "/problems/admin/**", "/topics/admin/**").hasRole("ADMIN");
            request.requestMatchers("/user/**").authenticated();
            request.anyRequest().authenticated();
        });

        httpSecurity.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        httpSecurity.userDetailsService(userDetailsService);
        httpSecurity.httpBasic(Customizer.withDefaults());
        httpSecurity.formLogin(Customizer.withDefaults());
        // JWT filter using configured secret
        httpSecurity.addFilterBefore(new JwtAuthenticationFilter(jwtUtil()), UsernamePasswordAuthenticationFilter.class);

//        httpSecurity.oauth2Login((oauth) -> {
//            oauth.successHandler(oAuthAuthenticationSuccessHandler);
//            oauth.failureHandler(oAuthAuthenticationFailureHandler);
//        });

        return httpSecurity.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Property-driven CORS whitelist
        List<String> origins = Arrays.stream(corsAllowedOrigins.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
        configuration.setAllowedOriginPatterns(origins);
        
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L); // Cache preflight for 1 hour
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public JwtUtil jwtUtil() {
        return new JwtUtil(jwtSecret, jwtExpirationMs);
    }

    @Bean
    public ModelMapper modelMapper(){
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        return modelMapper;
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder(){
        return new BCryptPasswordEncoder();
    }

}
