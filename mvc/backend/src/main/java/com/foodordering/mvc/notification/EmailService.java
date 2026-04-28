package com.foodordering.mvc.notification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

   public void sendWelcomeEmail(String toEmail) {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setTo(toEmail);
    message.setSubject("Welcome Back!");

    message.setText(
        "Hello ,\n\n" +
        "Welcome back to our Food Ordering System 🍔\n" +
        "We're glad to see you again!\n\n" +
        "Enjoy your experience.\n\n" +
        "Best regards,\nFood Ordering Team"
    );

    mailSender.send(message);
}

}
