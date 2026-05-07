package com.foodordering.mvc.service;

import com.foodordering.mvc.repository.UserRepository;
import com.foodordering.mvc.DTO.NotificationRequest;
import com.foodordering.mvc.notification.NotificationInterface;
import com.foodordering.mvc.persistence.UserDocument;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
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
    
  
    private NotificationInterface welcomeEmail = new EmailService();
    

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    

    public UserDocument login(String email, String password) {

        String normalizedEmail = normalizeEmail(email);

        UserDocument user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("USER FOUND: " + user.getEmail());

        boolean match = passwordEncoder.matches(password, user.getPassword());

        System.out.println("PASSWORD MATCH: " + match);

        if (!match) {
            throw new RuntimeException("Invalid password");
        }

        
        NotificationRequest req = new NotificationRequest();
        req.setTo(user.getEmail());
        req.setSubject("Hello " + user.getName() + ",\n"+ "Welcome to Food Ordering System!");
        req.setMessage("We're glad to see you again!\n\n" +
        "Enjoy your experience.\n\n" +
        "Best regards,\nFood Ordering Team");
        req.setUserName(user.getName());

        try {
            welcomeEmail.sendNotification(req);
            System.out.println("Email sent to: " + user.getEmail());
        } catch (Exception e) {
            System.out.println("Email failed: " + user.getEmail() + " - " + e.getMessage());
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

        
            NotificationRequest req = new NotificationRequest();
            req.setTo(user.getEmail());
            req.setSubject("Welcome to Food Ordering System!");
            req.setMessage("We're glad to see you!\n\n" +"Your account has been created successfully.\n\n" +
            "Best regards,\nFood Ordering Team");
            req.setUserName(user.getName());
        try {
            welcomeEmail.sendNotification(req);
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

    public List<UserDocument> getAllUsers() {
        return userRepository.findAll();
    }

    public UserDocument createUserByAdmin(String name, String email, String phone, String address, String role, String password) {
        String normalizedEmail = normalizeEmail(email);
        Optional<UserDocument> existing = userRepository.findByEmail(normalizedEmail);
        if (existing.isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        if (password == null || password.isBlank()) {
            throw new RuntimeException("Password is required");
        }

        String encodedPassword = passwordEncoder.encode(password.trim());
        UserDocument user = buildCustomerUser(normalizedEmail, encodedPassword, name, phone, address);
        applyRoleDefaults(user, role);
        return userRepository.save(user);
    }

    public UserDocument updateUserByAdmin(String id, String name, String email, String phone, String address, String role, String password) {
        UserDocument user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (email != null && !email.isBlank()) {
            String normalizedEmail = normalizeEmail(email);
            Optional<UserDocument> existing = userRepository.findByEmail(normalizedEmail);
            if (existing.isPresent() && !existing.get().getId().equals(id)) {
                throw new RuntimeException("Email already exists");
            }
            user.setEmail(normalizedEmail);
        }
        if (name != null) {
            user.setName(name);
        }
        if (phone != null) {
            user.setPhone(phone);
        }
        if (address != null) {
            user.setAddress(address);
        }
        if (password != null && !password.isBlank()) {
            user.setPassword(passwordEncoder.encode(password.trim()));
        }
        if (role != null && !role.isBlank()) {
            applyRoleDefaults(user, role);
        }
        return userRepository.save(user);
    }

    public void deleteUserById(String id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
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

    private void applyRoleDefaults(UserDocument user, String role) {
        String normalizedRole = role == null ? "CUSTOMER" : role.trim().toUpperCase(Locale.ROOT);
        if ("ADMIN".equals(normalizedRole)) {
            user.setRole("ADMIN");
            user.setPermissions(ADMIN_PERMISSIONS);
            if (user.getPreferences() == null || user.getPreferences().isEmpty()) {
                user.setPreferences(defaultAdminPreferences());
            }
        } else {
            user.setRole("CUSTOMER");
            user.setPermissions(List.of());
            if (user.getPreferences() == null || user.getPreferences().isEmpty()) {
                user.setPreferences(defaultCustomerPreferences());
            }
        }
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

