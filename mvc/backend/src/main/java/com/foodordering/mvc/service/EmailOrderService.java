package com.foodordering.mvc.service;
import javax.management.Notification;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Async;
import com.foodordering.mvc.DTO.NotificationRequest;
import com.foodordering.mvc.notification.NotificationInterface;

@Service
public class EmailOrderService implements NotificationInterface {

    @Autowired
    private JavaMailSender mailSender;

    @Async
    @Override
    public void sendNotification(NotificationRequest request) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(request.getTo());
        message.setSubject(request.getSubject());
        message.setText(request.getMessage());

        mailSender.send(message);
    }
}
