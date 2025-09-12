package com.example.medicine.med_pres.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.medicine.med_pres.model.Doctor;
import com.example.medicine.med_pres.repository.DoctorRepository;

@Service
public class DoctorService {
    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    // Create Doctor
    public Doctor createDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    // Get all Doctors
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    // Get Doctor by ID
    public Optional<Doctor> getDoctorById(Long id) {
        return doctorRepository.findById(id);
    }

    // Update Doctor
    public Doctor updateDoctor(Long id, Doctor updatedDoctor) {
        return doctorRepository.findById(id).map(existing -> {
            existing.setSpecialization(updatedDoctor.getSpecialization());
            existing.setClinicName(updatedDoctor.getClinicName());
            existing.setUser(updatedDoctor.getUser());
            return doctorRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Doctor not found with id " + id));
    }

    // Delete Doctor
    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }
}