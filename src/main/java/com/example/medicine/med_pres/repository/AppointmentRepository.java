package com.example.medicine.med_pres.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.medicine.med_pres.model.Appointment;
import com.example.medicine.med_pres.model.Doctor;
import com.example.medicine.med_pres.model.User;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientId(User patientId);
    List<Appointment> findByDoctorId(Doctor doctorId);
}
