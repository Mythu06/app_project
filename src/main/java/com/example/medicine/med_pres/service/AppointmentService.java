package com.example.medicine.med_pres.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.medicine.med_pres.model.Appointment;
import com.example.medicine.med_pres.model.Doctor;
import com.example.medicine.med_pres.model.User;
import com.example.medicine.med_pres.repository.AppointmentRepository;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;

    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    // Create Appointment
    public Appointment createAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    // Get all Appointments
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    // Get Appointment by ID
    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    public List<Appointment> getAppointmentsByPatient(User patientId) {
    return appointmentRepository.findByPatientId(patientId);
}

public List<Appointment> getAppointmentsByDoctor(Doctor doctorId) {
    return appointmentRepository.findByDoctorId(doctorId);
}

    // Update Appointment
    public Appointment updateAppointment(Long id, Appointment updatedAppointment) {
        return appointmentRepository.findById(id).map(existing -> {
            existing.setReason(updatedAppointment.getReason());
            existing.setAppointmentDate(updatedAppointment.getAppointmentDate());
            existing.setAppointmentTime(updatedAppointment.getAppointmentTime());
            existing.setStatus(updatedAppointment.getStatus());
            existing.setDoctor(updatedAppointment.getDoctor());
            existing.setPatient(updatedAppointment.getPatient());
            return appointmentRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Appointment not found with id " + id));
    }

    // Delete Appointment
    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }
}