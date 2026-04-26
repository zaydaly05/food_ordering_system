package com.foodordering.users.controller;

import com.foodordering.users.persistence.UserDocument;
import com.foodordering.users.service.UserService;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
public class UserAuthController {
    private final UserService userService;

    public UserAuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/auth/login")
    public ResponseEntity<UserDocument> login(@RequestBody LoginRequest request) {
        UserDocument user = userService.login(request.email(), request.password());
        return ResponseEntity.ok(user);
    }

    @PostMapping("/auth/signup")
    public ResponseEntity<UserDocument> signup(@RequestBody SignupRequest request) {
        UserDocument user = userService.signup(
                request.name(),
                request.email(),
                request.password(),
                request.phone(),
                request.address()
        );
        return ResponseEntity.ok(user);
    }

    @PutMapping("/users/{id}/profile")
    public ResponseEntity<UserDocument> updateProfile(@PathVariable String id, @RequestBody UpdateProfileRequest request) {
        Optional<UserDocument> updated = userService.updateProfile(id, request.name(), request.phone(), request.address());
        return updated.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/users/{id}/preferences")
    public ResponseEntity<UserDocument> updatePreferences(@PathVariable String id, @RequestBody Map<String, Object> preferences) {
        Optional<UserDocument> updated = userService.updatePreferences(id, preferences);
        return updated.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    public record LoginRequest(@Email @NotBlank String email, String password) {
    }

    public record SignupRequest(String name, @Email @NotBlank String email, String password, String phone, String address) {
    }

    public record UpdateProfileRequest(String name, String phone, String address) {
    }
}
