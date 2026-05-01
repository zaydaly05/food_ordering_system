package com.foodordering.mvc.service;

import com.foodordering.mvc.repository.UserRepository;
import com.foodordering.mvc.notification.EmailService;
import com.foodordering.mvc.persistence.UserDocument;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {
    private final PasswordEncoder passwordEncoder;

    private static final String ADMIN_EMAIL = "admin@foodapp.demo";
    private static final List<String> ADMIN_PERMISSIONS = List.of("MANAGE_PRODUCTS", "MANAGE_ORDERS", "VIEW_REPORTS");

    private final UserRepository userRepository;
    @Autowired
    private EmailService emailService;


    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDocument login(String email, String password) {

    System.out.println("RAW EMAIL: " + email);

    String normalizedEmail = normalizeEmail(email);
    System.out.println("NORMALIZED EMAIL: " + normalizedEmail);

    UserDocument user = userRepository.findByEmail(normalizedEmail)
            .orElseThrow(() -> new RuntimeException("User not found"));

    System.out.println("USER FOUND: " + user.getEmail());

    boolean match = passwordEncoder.matches(password, user.getPassword());

    System.out.println("PASSWORD MATCH: " + match);

    if (!match) {
        throw new RuntimeException("Invalid password");
    }

    return user;
}



   public UserDocument signup(String name, String email, String password, String phone, String address) {

    String normalizedEmail = normalizeEmail(email);

    Optional<UserDocument> existing = userRepository.findByEmail(normalizedEmail);

    if (existing.isPresent()) {
        return existing.get(); 
    }
     String encodedPassword = passwordEncoder.encode(password);

    UserDocument user = userRepository.save(
            buildCustomerUser(normalizedEmail, encodedPassword, name, phone, address)
    );

    try {
        emailService.sendWelcomeEmail(user.getEmail());
        System.out.println("Email sent to: " + user.getEmail());
    } catch (Exception e) {
        System.out.println("Email failed: " + user.getEmail() + " - " + e.getMessage());
    }

    return user;
}


    public Optional<UserDocument> updateProfile(String id, String name, String phone, String address) {
        Optional<UserDocument> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return Optional.empty();
        }

        UserDocument user = userOpt.get();
        if (name != null) {
            user.setName(name);
        }
        if (phone != null) {
            user.setPhone(phone);
        }
        if (address != null) {
            user.setAddress(address);
        }
        return Optional.of(userRepository.save(user));
    }

    public Optional<UserDocument> updatePreferences(String id, Map<String, Object> preferences) {
        Optional<UserDocument> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return Optional.empty();
        }

        UserDocument user = userOpt.get();
        Map<String, Object> nextPreferences = new HashMap<>();
        if (user.getPreferences() != null) {
            nextPreferences.putAll(user.getPreferences());
        }
        if (preferences != null) {
            nextPreferences.putAll(preferences);
        }
        user.setPreferences(nextPreferences);
        return Optional.of(userRepository.save(user));
    }

    private UserDocument buildAdminUser() {
        UserDocument user = new UserDocument();
        user.setName("System Admin");
        user.setEmail(ADMIN_EMAIL);
        user.setRole("ADMIN");
        user.setPermissions(ADMIN_PERMISSIONS);
        user.setPreferences(defaultAdminPreferences());
        return user;
    }

    private UserDocument buildCustomerUser(String email, String password, String name, String phone, String address) {
        UserDocument user = new UserDocument();
        user.setEmail(email);
        user.setPassword(password);
        user.setRole("CUSTOMER");
        user.setName(name != null && !name.isBlank() ? name : email.split("@")[0]);
        user.setPhone(phone != null ? phone : "");
        user.setAddress(address != null ? address : "");
        user.setLoyaltyPoints(0);
        user.setPreferences(defaultCustomerPreferences());
        return user;
    }

    private Map<String, Object> defaultAdminPreferences() {
        Map<String, Object> preferences = new HashMap<>();
        preferences.put("newsletter", false);
        preferences.put("defaultPayment", "instapay");
        preferences.put("theme", "light");
        return preferences;
    }

    private Map<String, Object> defaultCustomerPreferences() {
        Map<String, Object> preferences = new HashMap<>();
        preferences.put("newsletter", true);
        preferences.put("defaultPayment", "instapay");
        preferences.put("theme", "light");
        return preferences;
    }

    private String normalizeEmail(String email) {
        return email == null ? "" : email.trim().toLowerCase(Locale.ROOT);
    }
}

