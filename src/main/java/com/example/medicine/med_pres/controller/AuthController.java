package com.example.medicine.med_pres.controller;

import com.example.medicine.med_pres.model.User;
import com.example.medicine.med_pres.model.Doctor;
import com.example.medicine.med_pres.service.JwtService;
import com.example.medicine.med_pres.service.UserService;
import com.example.medicine.med_pres.service.DoctorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final DoctorService doctorService;

    public AuthController(UserService userService, JwtService jwtService, PasswordEncoder passwordEncoder, DoctorService doctorService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
        this.doctorService = doctorService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        System.out.println("DEBUG: Login attempt for email: " + loginRequest.get("email"));
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        User user = userService.findByEmail(email);
        System.out.println("DEBUG: User found: " + (user != null));
        if (user != null && passwordEncoder.matches(password, user.getPasswordHash())) {
            String token = jwtService.generateToken(user.getEmail(), user.getRole().toString());
            System.out.println("DEBUG: Login successful, token generated");
            return ResponseEntity.ok(Map.of("token", token, "role", user.getRole()));
        }
        System.out.println("DEBUG: Login failed - invalid credentials");
        return ResponseEntity.badRequest().body("Invalid credentials");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, Object> registrationData) {
        String email = (String) registrationData.get("email");
        System.out.println("DEBUG: Registration attempt for email: " + email);
        
        // Check if user already exists
        if (userService.findByEmail(email) != null) {
            System.out.println("DEBUG: Email already exists: " + email);
            return ResponseEntity.badRequest().body("Email already registered. Please use a different email or login.");
        }
        
        try {
            // Create User
            User user = new User();
            user.setName((String) registrationData.get("name"));
            user.setEmail(email);
            user.setPasswordHash(passwordEncoder.encode((String) registrationData.get("passwordHash")));
            user.setRole(User.Role.valueOf((String) registrationData.get("role")));
            
            User savedUser = userService.createUser(user);
            System.out.println("DEBUG: User registered successfully with ID: " + savedUser.getId());
            
            // If doctor, create doctor profile
            if ("DOCTOR".equals(registrationData.get("role"))) {
                System.out.println("DEBUG: Creating doctor profile...");
                System.out.println("DEBUG: Specialization: " + registrationData.get("specialization"));
                System.out.println("DEBUG: Clinic: " + registrationData.get("clinicName"));
                System.out.println("DEBUG: Location: " + registrationData.get("location"));
                
                Doctor doctor = new Doctor();
                doctor.setUser(savedUser);
                doctor.setSpecialization((String) registrationData.get("specialization"));
                doctor.setClinicName((String) registrationData.get("clinicName"));
                doctor.setLocation((String) registrationData.get("location"));
                doctor.setAvailableSlots("[\"09:00\",\"10:30\",\"14:00\",\"15:30\"]"); // Default slots
                
                Doctor savedDoctor = doctorService.createDoctor(doctor);
                System.out.println("DEBUG: Doctor profile created successfully!");
                System.out.println("DEBUG: Doctor ID: " + savedDoctor.getId());
                System.out.println("DEBUG: Linked to User ID: " + savedUser.getId());
            }
            
            return ResponseEntity.ok(Map.of("message", "User registered successfully", "userId", savedUser.getId()));
        } catch (Exception e) {
            System.out.println("DEBUG: Registration failed: " + e.getMessage());
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }
}