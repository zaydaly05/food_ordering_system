package com.foodordering.mvc.controller;

import com.foodordering.mvc.persistence.UserDocument;
import com.foodordering.mvc.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
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
    public ResponseEntity<UserDocument> login(@Valid @RequestBody LoginRequest request) {
        UserDocument user = userService.login(
                request.email(),
                request.password()
        );
        return ResponseEntity.ok(user);
    }

    @PostMapping("/auth/signup")
    public ResponseEntity<UserDocument> signup(@Valid @RequestBody SignupRequest request) {
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

    @GetMapping("/users")
    public ResponseEntity<List<UserDocument>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping("/users")
    public ResponseEntity<UserDocument> createUserByAdmin(@Valid @RequestBody CreateUserRequest request) {
        UserDocument created = userService.createUserByAdmin(
                request.name(),
                request.email(),
                request.phone(),
                request.address(),
                request.role(),
                request.password()
        );
        return ResponseEntity.ok(created);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<UserDocument> updateUserByAdmin(@PathVariable String id, @RequestBody UpdateUserRequest request) {
        UserDocument updated = userService.updateUserByAdmin(
                id,
                request.name(),
                request.email(),
                request.phone(),
                request.address(),
                request.role(),
                request.password()
        );
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUserByAdmin(@PathVariable String id) {
        userService.deleteUserById(id);
        return ResponseEntity.noContent().build();
    }

    public record LoginRequest(@Email @NotBlank String email, @NotBlank String password) {
    }

    public record SignupRequest(String name, @Email @NotBlank String email, @NotBlank String password, String phone, String address) {
    }

    public record UpdateProfileRequest(String name, String phone, String address) {
    }

    public record CreateUserRequest(
            String name,
            @Email @NotBlank String email,
            String phone,
            String address,
            String role,
            @NotBlank String password
    ) {
    }

    public record UpdateUserRequest(
            String name,
            String email,
            String phone,
            String address,
            String role,
            String password
    ) {
    }
}

