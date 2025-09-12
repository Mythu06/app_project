package com.example.medicine.med_pres.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.medicine.med_pres.model.User;


public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);  // used for login
    boolean existsByEmail(String email);
}