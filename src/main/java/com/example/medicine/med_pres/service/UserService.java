package com.example.medicine.med_pres.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.medicine.med_pres.model.User;
import com.example.medicine.med_pres.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Create User
    public User createUser(User user) {
        return userRepository.save(user);
    }

    // Get all Users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Get User by ID
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // Update User
    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id).map(existing -> {
            existing.setName(updatedUser.getName());
            existing.setEmail(updatedUser.getEmail());
            existing.setPasswordHash(updatedUser.getPasswordHash());
            existing.setRole(updatedUser.getRole());
            return userRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("User not found with id " + id));
    }

    // Delete User
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // Find User by Email
    public User findByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
}