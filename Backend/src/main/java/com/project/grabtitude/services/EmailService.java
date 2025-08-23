package com.project.grabtitude.services;

import java.io.IOException;

public interface EmailService {
    public void send(String to, String subject, String body) throws IOException;
}
