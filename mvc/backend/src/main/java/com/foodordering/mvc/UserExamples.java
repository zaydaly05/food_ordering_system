package com.foodordering.mvc;

import com.foodordering.mvc.factory.AdminFactory;
import com.foodordering.mvc.factory.CustomerFactory;
import com.foodordering.mvc.model.Admin;
import com.foodordering.mvc.model.Customer;
import com.foodordering.mvc.notification.EmailNotificationStrategy;
import com.foodordering.mvc.notification.UserNotifier;
import com.foodordering.mvc.view.BasicCustomerView;
import com.foodordering.mvc.view.CustomerView;
import com.foodordering.mvc.view.VipCustomerViewDecorator;

import java.util.List;

public class UserExamples {
    public String runDemo() {
        // Creational pattern (Factory Method)
        AdminFactory adminFactory = new AdminFactory("A1", "System Admin", "admin@food.com", List.of("MENU_EDIT"));
        CustomerFactory customerFactory = new CustomerFactory("C1", "Sara", "sara@food.com", "Cairo");

        Admin admin = adminFactory.create();
        Customer customer = customerFactory.create();

        // Behavioral pattern (Strategy)
        UserNotifier notifier = new UserNotifier(new EmailNotificationStrategy());
        String notificationResult = notifier.notify(admin, "A new order needs review.");

        // Structural pattern (Decorator)
        CustomerView view = new VipCustomerViewDecorator(new BasicCustomerView(customer));
        String customerSummary = view.profileSummary();

        return notificationResult + " | " + customerSummary + " | Can manage menu: " + admin.canManage("MENU_EDIT");
    }
}

