package com.example.medicine.med_pres.config;

import com.example.medicine.med_pres.model.User;
import com.example.medicine.med_pres.model.User.Role;
import com.example.medicine.med_pres.model.Doctor;
import com.example.medicine.med_pres.service.UserService;
import com.example.medicine.med_pres.service.DoctorService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final DoctorService doctorService;

    public DataLoader(UserService userService, PasswordEncoder passwordEncoder, DoctorService doctorService) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.doctorService = doctorService;
    }

    @Override
    public void run(String... args) throws Exception {
        // Create test users if they don't exist
        if (userService.findByEmail("admin@example.com") == null) {
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@example.com");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setRole(Role.ADMIN);
            userService.createUser(admin);
            System.out.println("Created admin user: admin@example.com / admin123");
        }

        if (userService.findByEmail("doctor@example.com") == null) {
            User doctor = new User();
            doctor.setName("Dr. Smith");
            doctor.setEmail("doctor@example.com");
            doctor.setPasswordHash(passwordEncoder.encode("doctor123"));
            doctor.setRole(Role.DOCTOR);
            userService.createUser(doctor);
            System.out.println("Created doctor user: doctor@example.com / doctor123");
        }

        if (userService.findByEmail("patient@example.com") == null) {
            User patient = new User();
            patient.setName("John Patient");
            patient.setEmail("patient@example.com");
            patient.setPasswordHash(passwordEncoder.encode("patient123"));
            patient.setRole(Role.PATIENT);
            userService.createUser(patient);
            System.out.println("Created patient user: patient@example.com / patient123");
        }
        
        // Create sample doctors
        createSampleDoctors();
        
        System.out.println("\n=== Backend Ready ===");
        System.out.println("Test accounts created successfully!");
        System.out.println("Frontend URL: http://localhost:5173");
        System.out.println("Backend URL: http://localhost:8080");
        System.out.println("===================");
    }
    
    private void createSampleDoctors() {
        try {
            User doctorUser = userService.findByEmail("doctor@example.com");
            if (doctorUser != null && doctorService.getAllDoctors().isEmpty()) {
                Doctor doctor = new Doctor();
                doctor.setUser(doctorUser);
                doctor.setSpecialization("Cardiology");
                doctor.setClinicName("Heart Care Center");
                doctor.setLocation("Downtown");
                doctor.setAvailableSlots("[\"09:00\",\"10:30\",\"14:00\",\"15:30\"]");
                doctorService.createDoctor(doctor);
                System.out.println("Created sample doctor with available slots");
            }
        } catch (Exception e) {
            System.out.println("Note: Could not create sample doctors - " + e.getMessage());
        }
    }
}