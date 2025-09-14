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
        // DataLoader disabled - only show existing data from database
        System.out.println("\n=== Backend Ready ===");
        System.out.println("DataLoader disabled - showing only existing database records");
        System.out.println("Frontend URL: http://localhost:5173");
        System.out.println("Backend URL: http://localhost:8080");
        System.out.println("===================");
    }

}