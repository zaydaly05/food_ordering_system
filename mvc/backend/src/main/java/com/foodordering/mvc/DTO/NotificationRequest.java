package com.foodordering.mvc.DTO;

public class NotificationRequest {

    private String to;
    private String subject;
    private String message;
    private String userName;
    private String orderId;
    private String status;

    
    public String getTo() {
        return to;
    }
     public void setTo(String to) {
        this.to = to;
     }
    public String getSubject() {
        return subject;
    }
    public void setSubject(String subject) {
        this.subject = subject;
    }
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
    public String getUserName() {
        return userName;
    }
    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getOrderId() {
        return orderId;
    }
    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
}