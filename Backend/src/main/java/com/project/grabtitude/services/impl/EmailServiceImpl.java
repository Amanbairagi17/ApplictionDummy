package com.project.grabtitude.services.impl;

import com.project.grabtitude.services.EmailService;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Slf4j
@Service
public class EmailServiceImpl implements EmailService {
    @Value("${sendgrid.api.key}")
    private String sendGridApiKey;

    @Value("${sendgrid.sender.email}")
    private String senderEmail;

    @Value("${sendgrid.sender.name}")
    private String senderName;
    @Override
    public void send(String to, String subject, String body) {
        try {
            log.info(sendGridApiKey);
            log.info(senderEmail);
            log.info(senderName);
            Email sender = new Email(senderEmail, senderName);
            Email recipient = new Email(to);
            Content content = new Content("text/plain", body);

            Mail mail = new Mail(sender, subject, recipient, content);

            SendGrid sendGrid = new SendGrid(sendGridApiKey);
            Request request = new Request();

            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sendGrid.api(request);

            log.info("Status code : " + response.getStatusCode());
            log.info("Body : " + response.getBody());
            log.info("Headers : " + response.getHeaders());
        }
        catch (IOException e){
            log.info(String.valueOf(e.getCause()));
        }
    }
}
