package com.example.medicine.med_pres.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.medicine.med_pres.model.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {}
